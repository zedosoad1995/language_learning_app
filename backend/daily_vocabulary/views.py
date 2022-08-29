from .tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models.functions import Lower
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from pytz.exceptions import UnknownTimeZoneError
from pytz import timezone as py_timezone
from datetime import datetime
from django.core.mail import EmailMessage, send_mail
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse, JsonResponse
from .serializers import UserSerializer, WordSerializer, WordPatchSerializer, WordPostSerializer
from .models import User, Word
from .utils.utils import calculate_new_score, get_datetime_as_timezone, get_days_since
from language_learning.settings import TIME_ZONE, EMAIL_FROM_USER
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import redirect
from django.http import HttpResponseRedirect


from django.template.loader import render_to_string

import os

FRONTEND_HOST = os.getenv('FRONTEND_HOST')


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated, ])
def current_user(request):
    """
    List and edit logged user.
    """
    try:
        logged_user = User.objects.get(pk=request.auth.get('user_id'))
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(logged_user)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'PATCH':
        data = JSONParser().parse(request)
        serializer = UserSerializer(logged_user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny, ])
def user_list(request):
    """
    List all users, or create a new user.
    """
    """ if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False) """

    if request.method == 'POST':
        data = JSONParser().parse(request)
        data['last_update'] = timezone.now()
        data.setdefault('timezone', TIME_ZONE)

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            domain = get_current_site(request).domain

            uid = urlsafe_base64_encode(force_bytes(serializer.instance.id))
            token = account_activation_token.make_token(serializer.instance)

            message = render_to_string('account_activation_email.html', {
                'user': serializer.instance,
                'domain': get_current_site(request).domain,
                'uid': urlsafe_base64_encode(force_bytes(serializer.instance.id)),
                'token': account_activation_token.make_token(serializer.instance),
            })

            send_mail(subject='Language Learning: Account activation', message=message, from_email=EMAIL_FROM_USER,
                      recipient_list=[serializer.instance.email])
            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)


def update_words(now, days_since_last_update):
    words = Word.objects.filter(is_learned=False)
    for word in words:
        days_since_curr_word = get_days_since(now, word.created_at_local)
        days_since_last_update = min(
            days_since_last_update, days_since_curr_word)

        if days_since_last_update > 0:
            if word.is_seen:
                word.score = 0
                word.is_seen = False
            else:
                word.score += calculate_new_score(
                    days_since_last_update, word.relevance, word.knowledge)

        word.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def update_word_scores(request):
    """
    Updates the scores of the words, taking into consideration how much time it has passed since last seeing
    """
    data = JSONParser().parse(request)

    logged_user = User.objects.filter(id=request.auth.get('user_id')).first()

    try:
        prev_update = get_datetime_as_timezone(
            logged_user.last_update, logged_user.timezone)

        tz_name = data.get('timezone', logged_user.timezone)
        now_utc = timezone.now()
        now = get_datetime_as_timezone(now_utc, tz_name)
    except UnknownTimeZoneError:
        return JsonResponse('Invalid timezone', status=400, safe=False)

    days_since_last_update = get_days_since(now, prev_update)
    if days_since_last_update <= 0:
        return HttpResponse(status=200)

    update_words(now, days_since_last_update)

    logged_user.timezone = tz_name
    logged_user.last_update = now_utc
    logged_user.save()

    return HttpResponse(status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def daily_words_list(request):
    """
    List the top n words of the day, ordered by score (where n is the number of daily words)
    """
    user_id = request.auth.get('user_id')
    logged_user = User.objects.filter(id=user_id).first()

    current_date = get_datetime_as_timezone(
        timezone.now(), logged_user.timezone)

    # To exclude words added in that day (or after) to being returned
    current_day_filter = {
        'created_at_local__date__gte': current_date.date(),
        # 'created_at_local__time__gte': current_date.time().replace(second=0, microsecond=0) # TODO: remove
    }

    num_daily_words = logged_user.num_daily_words
    words = Word.objects.filter(user__id=user_id, is_learned=False)\
        .exclude(**current_day_filter)\
        .order_by('-score')[:num_daily_words]

    serializer = WordSerializer(words, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, ])
def words_list(request):
    """
    List words, or create a new word.
    """
    if request.method == 'GET':
        words = Word.objects.filter(user__id=request.auth.get('user_id'))\
                    .order_by(Lower('original_word'))

        serializer = WordSerializer(words, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data['user'] = request.auth.get('user_id')
        data['created_at'] = timezone.now()

        serializer = WordPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated, ])
def word_detail(request, pk):
    """
    Retrieve, update or delete a word.
    """
    try:
        word = Word.objects.get(pk=pk, user__id=request.auth.get('user_id'))
    except Word.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = WordSerializer(word)
        return JsonResponse(serializer.data)

    elif request.method == 'PATCH':
        data = JSONParser().parse(request)
        serializer = WordPatchSerializer(word, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        word.delete()
        return HttpResponse(status=204)


@api_view(['GET'])
def validate_user(request, uidb64, token, *args, **kwargs):
    if request.method == 'GET':
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_email_verified = True
            user.save()
            return HttpResponseRedirect(f'{FRONTEND_HOST}/login', status=302)
        else:
            return HttpResponse(status=401)
