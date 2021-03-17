from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _

from tests_history.models import PSTestHistory


class User(AbstractUser):
    class UserType(models.IntegerChoices):
        CLIENT = 1, _("CLIENT")
        PSYCHOLOGIST = 2, _("PSYCHOLOGIST")

    user_type = models.PositiveSmallIntegerField(
        choices=UserType.choices,
        default=UserType.CLIENT,
        editable=False,
        verbose_name=_("User type"),
    )

    last_test = models.ForeignKey(
        PSTestHistory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Last test"),
    )

    def __str__(self) -> str:
        return self.username
