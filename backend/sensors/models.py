from dry_rest_permissions.generics import authenticated_users

from commons.fields import PulseField
from commons.models import BaseModel
from django.db import models
from django.utils.translation import gettext as _


class PulseRecord(BaseModel):
    test_step = models.ForeignKey(
        "tests_history.PSTestStepHistory",
        on_delete=models.CASCADE,
        verbose_name=_("Test Step History"),
    )
    pulse = PulseField()

    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return False

    @authenticated_users
    def has_object_read_permission(self, request):
        return False

    @staticmethod
    @authenticated_users
    def has_create_permission(request):
        return request.user.user_type == request.user.UserType.CLIENT

    def has_object_write_permission(self, request):
        return request.user.is_superuser
