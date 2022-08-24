from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse, JsonResponse
from daily_vocabulary.models import User


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request):
        username = request.data['username']
        user = User.objects.get(username=username)
        if user and not user.is_email_verified:
            raise Exception('User Email is not verified')

        return super().post(request)
