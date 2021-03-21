from django.db.models import Q, Value
from django.db.models.functions import Concat
from django.utils.translation import gettext as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from users.models import InviteToContact, User
from users.serializers import (
    InviteToContactDetailSerializer,
    InviteToContactSerializer,
    MyUserListSerializer,
    MyUserShortSerializer,
)


class InviteToContactViewSet(ModelViewSet):
    queryset = InviteToContact.objects.select_related("to_user", "from_user")
    serializer_class = InviteToContactDetailSerializer

    def get_queryset(self):
        queryset = super(InviteToContactViewSet, self).get_queryset()
        queryset = queryset.filter(
            to_user=self.request.user, status=InviteToContact.Statuses.PENDING
        )
        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return InviteToContactSerializer
        return super(InviteToContactViewSet, self).get_serializer_class()

    def perform_create(self, serializer):
        to_user = serializer.validated_data["to_user"]
        if self.request.user == to_user:
            raise ValidationError(detail=_("Can't invite yourself"))
        if self.request.user.user_type == to_user.user_type:
            raise ValidationError(detail=_("Can't invite the same user type"))
        contacts = self.request.user.contacts.all()
        if to_user in contacts:
            raise ValidationError(detail=_("User is already in your contacts"))
        serializer.save(from_user=self.request.user)

    @action(methods=("POST",), detail=True)
    def accept(self, request, pk=None):
        invite = self.get_object()
        invite.accept()

    @action(methods=("POST",), detail=True)
    def deny(self, request, pk=None):
        invite = self.get_object()
        invite.deny()


class ExtraUsersViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet
):
    queryset = User.objects.all()
    serializer_class = MyUserListSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = (
        "id",
        "user_type",
        "last_step",
    )
    search_fields = (
        "username",
        "first_name",
        "last_name",
        "full_name",
    )
    ordering_fields = search_fields

    def get_queryset(self):
        queryset = super(ExtraUsersViewSet, self).get_queryset()
        queryset = queryset.annotate(
            full_name=Concat("first_name", Value(" "), "last_name")
        ).order_by("full_name")
        queryset = queryset.filter(~Q(user_type=self.request.user.user_type))
        return queryset
