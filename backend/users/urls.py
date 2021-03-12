from django.urls import include, path
from rest_framework.routers import DefaultRouter

app_name = "users"

router = DefaultRouter()

urlpatterns = [
    path(r"auth/", include("djoser.urls")),
    path(r"auth/", include("djoser.urls.jwt")),
    path("", include(router.urls)),
]
