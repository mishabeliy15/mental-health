from collections import namedtuple

from commons.models import BaseModel
from django.db import models
from django.utils.translation import gettext as _
from dry_rest_permissions.generics import authenticated_users
from tests_engine.models import PSTest

Variance = namedtuple("Variance", "var,n")


class PSTestHistory(BaseModel):
    class PSTestHistoryStatus(models.IntegerChoices):
        IN_PROGRESS = 1, _("IN_PROGRESS")
        COMPLETED = 2, _("COMPLETED")
        NOT_COMPLETED = 3, _("NOT_COMPLETED")

    test = models.ForeignKey(
        PSTest, on_delete=models.CASCADE, verbose_name=_("Test"), db_index=True
    )
    owner = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, verbose_name=_("Owner"), db_index=True
    )
    status = models.PositiveSmallIntegerField(
        _("Status"),
        choices=PSTestHistoryStatus.choices,
        default=PSTestHistoryStatus.IN_PROGRESS,
    )

    def __str__(self):
        return self.test.name

    def get_mse(self):
        steps = self.psteststephistory_set.all()
        mse = n = 0.0
        for step in steps:
            variance = step.get_variance()
            mse += variance.var
            n += variance.n
        if n == 0.0:
            return 0.0
        mse = (mse / n) ** 0.5
        return mse

    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return True

    @authenticated_users
    def has_object_read_permission(self, request):
        return True

    @staticmethod
    @authenticated_users
    def has_create_permission(request):
        return request.user.user_type == request.user.UserType.CLIENT

    @staticmethod
    @authenticated_users
    def has_write_permission(request):
        return request.user.user_type == request.user.UserType.CLIENT

    def has_object_write_permission(self, request):
        return request.user == self.owner


class PSTestStepHistory(models.Model):
    test_history = models.ForeignKey(
        PSTestHistory,
        on_delete=models.CASCADE,
        verbose_name="Test history",
        db_index=True,
    )
    step = models.ForeignKey(
        "tests_engine.PSTestStep",
        on_delete=models.CASCADE,
        verbose_name=_("Test Step"),
        db_index=True,
    )
    started_at = models.DateTimeField(
        auto_now_add=True, verbose_name=_("Started at"), db_index=True
    )
    ended_at = models.DateTimeField(verbose_name=_("Ended at"))

    class Meta:
        ordering = ("started_at",)
        unique_together = ("test_history", "step")

    def get_mse(self) -> float:
        variance = self.get_variance()
        if variance.n == 0.0:
            return 0.0
        mse = (variance.var / variance.n) ** 0.5
        return mse

    def get_variance(self) -> Variance:
        pulses = tuple(self.pulserecord_set.values_list("pulse", flat=True))
        min_pulse, max_pulse = self.step.min_pulse, self.step.max_pulse
        mse = 0.0
        for pulse in pulses:
            if pulse > max_pulse or pulse < min_pulse:
                mse += (pulse - max_pulse) ** 2
        variance = Variance(var=mse, n=len(pulses))
        return variance

    @staticmethod
    @authenticated_users
    def has_read_permission(request):
        return True

    @authenticated_users
    def has_object_read_permission(self, request):
        return True

    @staticmethod
    @authenticated_users
    def has_create_permission(request):
        return request.user.user_type == request.user.UserType.CLIENT

    def has_object_write_permission(self, request):
        return request.user == self.test_history.owner
