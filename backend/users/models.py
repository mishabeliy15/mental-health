from uuid import uuid4

from commons.models import BaseModel
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _
from tests_history.models import PSTestStepHistory


def user_avatar_directory_path(instance: "User", filename: str) -> str:
    test_media_dir = f"users/avatars/{uuid4()!s}/{filename}"
    return test_media_dir


class User(AbstractUser):
    class UserType(models.IntegerChoices):
        CLIENT = 1, _("CLIENT")
        PSYCHOLOGIST = 2, _("PSYCHOLOGIST")

    class SexType(models.IntegerChoices):
        MElA = 1, _("MElA")
        FEMALE = 2, _("FEMALE")

    user_type = models.PositiveSmallIntegerField(
        choices=UserType.choices,
        default=UserType.CLIENT,
        editable=False,
        verbose_name=_("User type"),
    )

    last_step = models.ForeignKey(
        PSTestStepHistory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Last test step"),
    )

    contacts = models.ManyToManyField(
        "self", symmetrical=True, verbose_name=_("Contacts"), db_index=True, blank=True
    )

    date_of_birthday = models.DateField(_("Date Of Birthday"), null=True, blank=True)
    sex = models.PositiveSmallIntegerField(
        choices=SexType.choices, verbose_name=_("Sex"), null=True, blank=True
    )
    avatar = models.ImageField(
        upload_to=user_avatar_directory_path,
        verbose_name=_("Avatar"),
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        return self.username

    # @property
    # def full_name(self):
    #     return f"{self.first_name} {self.last_name}"


class InviteToContact(BaseModel):
    class Statuses(models.IntegerChoices):
        PENDING = 1, _("PENDING")
        ACCEPTED = 2, _("ACCEPTED")
        DENIED = 3, _("DENIED")

    status = models.PositiveSmallIntegerField(
        choices=Statuses.choices,
        default=Statuses.PENDING,
        verbose_name=_("Status"),
        db_index=True,
    )
    from_user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        verbose_name=_("From"),
        related_name="received_invites",
        db_index=True,
    )
    to_user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        verbose_name=_("To"),
        related_name="sent_invites",
    )

    class Meta:
        ordering = ("-created",)

    def accept(self):
        if self.to_user not in self.from_user.contacts.all():
            self.from_user.contacts.add(self.to_user)
        self.status = self.Statuses.ACCEPTED
        self.save(update_fields=("status",))

    def deny(self):
        self.status = self.Statuses.DENIED
        self.save(update_fields=("status",))
