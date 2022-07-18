"""
ASGI config for language_learning project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

stage = os.getenv('STAGE')

if stage == 'dev':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'language_learning.settings-development')
elif stage == 'prod':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'language_learning.settings-production')

application = get_asgi_application()
