from django.utils.translation import gettext as _
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from users.models import InviteToContact
from users.serializers import InviteToContactDetailSerializer, InviteToContactSerializer


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
