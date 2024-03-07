"""
URL configuration for turbofinder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from react_app.views import react_index
from django.contrib.staticfiles.views import serve


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('react_app.urls')),
    path('api/', include('vehicle.urls')),
    path('api/', include('emissions_estimator.urls')),
    path('react/', react_index, name='react_index'),
    path('api/token/',obtain_auth_token, name='obtain-auth-token')
]
if settings.DEBUG:
    urlpatterns += [
        path('static/<path:path>', serve),
    ]