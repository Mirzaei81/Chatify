"""
ASGI config for mywebsite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

from channels.routing import ProtocolTypeRouter, URLRouter
import os 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mywebsite.settings')
os.environ.setdefault('DJANGO_CONFIGURATION', 'Prod')
from configurations.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
django_asgi_app = get_asgi_application()
from chat.routings import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
     "websocket": AllowedHostsOriginValidator(
         AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
     ),
})
