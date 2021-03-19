from djoser.serializers import UserCreateSerializer
from rest_framework.fields import ChoiceField
from rest_framework.serializers import ModelSerializer

from .models import User


class MyUserCreateSerializer(UserCreateSerializer):
    user_type = ChoiceField(User.UserType)

    class Meta(UserCreateSerializer.Meta):
        fields = (
            *UserCreateSerializer.Meta.fields,
            "first_name",
            "last_name",
            "user_type",
        )
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "user_type": {"required": True},
        }


class MyUserShortSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "date_joined")
