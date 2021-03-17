from django.utils.translation import gettext as _
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from tests_engine.models import Category, PSTest, PSTestStep


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class PSTestSerializer(ModelSerializer):
    class Meta:
        model = PSTest
        exclude = ("owner",)


class PSTestStepSerializer(ModelSerializer):
    class Meta:
        model = PSTestStep
        fields = "__all__"

    def validate(self, data):
        if data["min_pulse"] > data["max_pulse"]:
            raise ValidationError(_("Min pulse must be <= max pulse."))
        if data["ps_test"].owner != self.context["request"].user:
            raise ValidationError(_("You are not owner of this test."))
        return data
