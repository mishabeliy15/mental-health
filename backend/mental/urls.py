"""insurance URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.conf.global_settings import DEBUG
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('admin/i18n/', include('django.conf.urls.i18n')),
    path("api/v0/", include("users.urls")),
    path("api/v0/", include("tests_engine.urls")),
    path("api/v0/", include("tests_history.urls")),
    path("api/v0/", include("sensors.urls")),
    path("api/v0/", include("management.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # API DOCS UI:
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

if DEBUG:
    urlpatterns += [
        path("api/dev/", include("rest_framework.urls", namespace="rest_framework")),
    ]
