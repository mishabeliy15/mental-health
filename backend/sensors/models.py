from django.db import models
from django.utils.translation import gettext as _

from commons.fields import PulseField


class PulseRecord(models.Model):
    test_step = models.ForeignKey(
        "tests_history.PSTestStepHistory",
        on_delete=models.CASCADE,
        verbose_name=_("Test Step History"),
    )
    pulse = PulseField()
