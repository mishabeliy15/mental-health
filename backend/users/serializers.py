from djoser.serializers import UserCreateSerializer
from rest_framework.fields import ChoiceField
from rest_framework.serializers import CharField, ModelSerializer

from .models import InviteToContact, User


class MyUserCreateSerializer(UserCreateSerializer):
    user_type = ChoiceField(User.UserType)
    sex = ChoiceField(User.SexType)

    class Meta(UserCreateSerializer.Meta):
        fields = (
            *UserCreateSerializer.Meta.fields,
            "first_name",
            "last_name",
            "user_type",
            "sex",
            "date_of_birthday",
            "avatar",
        )
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "user_type": {"required": True},
            "date_of_birthday": {"required": True},
            "sex": {"required": True},
            "avatar": {"required": True},
        }


class MyUserShortSerializer(ModelSerializer):
    user_type = ChoiceField(User.UserType)
    sex = ChoiceField(User.SexType)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "user_type",
            "sex",
            "date_of_birthday",
            "avatar",
            "date_joined",
        )


class MyUserListSerializer(MyUserShortSerializer):
    full_name = CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            *MyUserShortSerializer.Meta.fields,
            "full_name",
        )


class InviteToContactSerializer(ModelSerializer):
    class Meta:
        model = InviteToContact
        fields = "__all__"
        read_only_fields = ("from_user",)


class InviteToContactDetailSerializer(InviteToContactSerializer):
    from_user = MyUserShortSerializer()
    to_user = MyUserShortSerializer()
