from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import CharField, PositiveSmallIntegerField, TextChoices
from django.utils.translation import gettext as _


class LanguageChoices(TextChoices):
    EN = "EN", _("English")
    UKR = "UKR", _("Ukrainian")


class LanguageField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("max_length", 3)
        kwargs.setdefault("choices", LanguageChoices.choices)
        kwargs.setdefault("verbose_name", _("Language"))
        super(CharField, self).__init__(*args, **kwargs)


class PulseField(PositiveSmallIntegerField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("verbose_name", _("Pulse"))
        kwargs.setdefault("validators", (MinValueValidator(60), MaxValueValidator(300)))
        super(PulseField, self).__init__(*args, **kwargs)
