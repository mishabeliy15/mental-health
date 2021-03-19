from uuid import uuid4

from commons.fields import LanguageField, PulseField
from commons.models import BaseModel
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext as _
from dry_rest_permissions.generics import authenticated_users


class Category(BaseModel):
    name_en = models.CharField(verbose_name=_("English Name"), max_length=32)
    name_ukr = models.CharField(verbose_name=_("Ukrainian Name"), max_length=32)

    def __str__(self):
        return self.name_en

    @staticmethod
    def has_read_permission(request):
        return request.user.is_authenticated

    def has_object_read_permission(self, request):
        return self.has_read_permission(request)

    @staticmethod
    @authenticated_users
    def has_write_permission(request):
        return request.user.is_superuser


class PSTest(BaseModel):
    name = models.CharField(verbose_name=_("Name"), max_length=256)
    language = LanguageField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, verbose_name=_("Category")
    )
    description = models.TextField(_("Description"), blank=True, default="")
    owner = models.ForeignKey(
        "users.User", on_delete=models.SET_NULL, null=True, verbose_name=_("Owner")
    )
    normal_mse = models.FloatField(
        validators=(MinValueValidator(1),), verbose_name=_("Normal Mean Square Error")
    )

    def __str__(self):
        return self.name

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
        return request.user.user_type == request.user.UserType.PSYCHOLOGIST

    def has_object_write_permission(self, request):
        return request.user == self.owner


def ps_test_media_directory_path(instance: "PSTestStep", filename: str) -> str:
    test_media_dir = f"ps_tests/{instance.ps_test.id}/step/{uuid4()!s}/{filename}"
    return test_media_dir


class PSTestStep(BaseModel):
    class MediaType(models.IntegerChoices):
        IMAGE = 1, _("Image")
        AUDIO = 2, _("Audio")
        VIDEO = 3, _("Video")

    ps_test = models.ForeignKey(
        PSTest, on_delete=models.CASCADE, verbose_name=_("Test")
    )
    help_text = models.CharField(
        verbose_name=_("Help text"), max_length=512, blank=True, default=""
    )
    media_type = models.PositiveSmallIntegerField(
        _("Media type"), choices=MediaType.choices
    )
    duration = models.PositiveIntegerField(verbose_name=_("Duration (s.)"))
    min_pulse = PulseField(verbose_name=_("Min normal pulse"),)
    max_pulse = PulseField(verbose_name=_("Max normal pulse"),)
    media_file = models.FileField(
        upload_to=ps_test_media_directory_path, verbose_name=_("Media file")
    )

    class Meta:
        constraints = (
            models.CheckConstraint(
                check=models.Q(min_pulse__lte=models.F("max_pulse")),
                name=_("Min pulse must be <= max price."),
            ),
        )

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
        return request.user.user_type == request.user.UserType.PSYCHOLOGIST

    def has_object_write_permission(self, request):
        return request.user == self.ps_test.owner
