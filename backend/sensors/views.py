import datetime

from django.utils.translation import gettext as _
from dry_rest_permissions.generics import DRYPermissions
from rest_framework.exceptions import APIException
from rest_framework.mixins import CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from sensors.models import PulseRecord
from sensors.serializers import PulseRecordSerializer


class PulseRecordViewSet(CreateModelMixin, GenericViewSet):
    queryset = PulseRecord.objects.select_related("test_step")
    serializer_class = PulseRecordSerializer
    permission_classes = (DRYPermissions,)
    filterset_fields = (
        "id",
        "language",
        "category",
        "owner",
        "created",
        "updated",
    )
    search_fields = (
        "name",
        "description",
    )

    def perform_create(self, serializer):
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        step = self.request.user.last_step
        if now > step.ended_at:
            raise APIException(detail=_("There is not active test step."))
        serializer.save(test_step=step)
