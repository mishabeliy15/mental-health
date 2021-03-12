from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _


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

    def __str__(self) -> str:
        return self.username
