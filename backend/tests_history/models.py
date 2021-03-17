from django.db import models

from commons.models import BaseModel
from tests_engine.models import PSTest
from django.utils.translation import gettext as _


class PSTestHistory(BaseModel):
    class PSTestHistoryStatus(models.IntegerChoices):
        IN_PROGRESS = 1, _("IN_PROGRESS")
        COMPLETED = 2, _("COMPLETED")
        NOT_COMPLETED = 3, _("NOT_COMPLETED")

    test = models.ForeignKey(
        PSTest, on_delete=models.CASCADE, verbose_name=_("Test"), db_index=True
    )
    status = models.PositiveSmallIntegerField(
        _("Status"),
        choices=PSTestHistoryStatus.choices,
        default=PSTestHistoryStatus.IN_PROGRESS,
    )


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
    started_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Started at"))
    ended_at = models.DateTimeField(verbose_name=_("Ended at"))
