from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.staticfiles.views import serve
from django.conf.urls.static import static
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi
from django.views.generic import TemplateView

schema_view = get_schema_view(
    openapi.Info(
        title="Turbo Finder API",
        default_version='v1',
        description="A Carbon Emissions Estimator for Vehicles.",
        contact=openapi.Contact(email="plaatjiesshagan@gmail.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/',  LoginView.as_view(), name='login'),
    path('logout/',  LogoutView.as_view(), name='logout'),
    path('register/',  RegisterView.as_view(), name='register'),
    path('api/', include('vehicle.urls')),
    path('api/', include('emissions_estimator.urls')),
    path('react/', include('react_app.urls')),
    # path('react_app/', TemplateView.as_view(template_name='react_app/static/index.html'), name='react-app'),
    # path('', serve, {'path': 'index.html'}, name='react-app-static'),
    path('api/token/', ObtainAuthToken.as_view(), name='obtain-auth-token'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
if settings.DEBUG:
    urlpatterns += [
        path('static/<path:path>', serve),
    ]