from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from tests_engine.models import Category, PSTest, PSTestStep
from users.serializers import MyUserShortSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class PSTestSerializer(serializers.ModelSerializer):
    owner = MyUserShortSerializer()

    class Meta:
        model = PSTest
        fields = "__all__"
        read_only_fields = ("owner",)


class PSTestStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = PSTestStep
        fields = "__all__"

    def validate(self, data):
        if data["min_pulse"] > data["max_pulse"]:
            raise ValidationError(_("Min pulse must be <= max pulse."))
        if data["ps_test"].owner != self.context["request"].user:
            raise ValidationError(_("You are not owner of this test."))
        return data


class PSTestDetailSerializer(PSTestSerializer):
    steps = PSTestStepSerializer(many=True, source="psteststep_set")
