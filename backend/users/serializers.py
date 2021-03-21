from djoser.serializers import UserCreateSerializer
from rest_framework.fields import ChoiceField, SerializerMethodField
from rest_framework.serializers import CharField, ModelSerializer

from .models import InviteToContact, User


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


class MyUserListSerializer(ModelSerializer):
    full_name = CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "full_name",
            "first_name",
            "last_name",
            "date_joined",
        )


class InviteToContactSerializer(ModelSerializer):
    class Meta:
        model = InviteToContact
        fields = "__all__"
        read_only_fields = ("from_user",)


class InviteToContactDetailSerializer(InviteToContactSerializer):
    from_user = MyUserShortSerializer()
    to_user = MyUserShortSerializer()
