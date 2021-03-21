from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import InviteToContactViewSet

app_name = "users"

router = DefaultRouter()
router.register("invites", InviteToContactViewSet)

urlpatterns = [
    path(r"auth/", include("djoser.urls")),
    path(r"auth/", include("djoser.urls.jwt")),
    path("", include(router.urls)),
]
