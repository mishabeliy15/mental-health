from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from sensors.serializers import PulseRecordSerializer
from tests_engine.serializers import PSTestSerializer, PSTestStepSerializer
from tests_history.models import PSTestHistory, PSTestStepHistory
from users.serializers import MyUserShortSerializer


class PSTestHistoryBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PSTestHistory
        fields = "__all__"
        read_only_fields = ("owner",)


class PSTestHistoryListSerializer(PSTestHistoryBaseSerializer):
    test = PSTestSerializer(read_only=True)


class PSTestStepHistoryBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PSTestStepHistory
        fields = "__all__"
        read_only_fields = ("ended_at",)

    def validate_test_history(self, value):
        if value.owner != self.context["request"].user:
            raise ValidationError(_("You are not owner of this test history."))
        return value


class PSTestStepHistoryDetailSerializer(PSTestStepHistoryBaseSerializer):
    mse = serializers.SerializerMethodField()
    step = PSTestStepSerializer()
    pulses = PulseRecordSerializer(source="pulserecord_set", many=True)

    def get_mse(self, obj: PSTestStepHistory) -> float:
        return obj.get_mse()


class PSTestHistoryDetailSerializer(PSTestHistoryListSerializer):
    mse = serializers.SerializerMethodField()
    step_history = PSTestStepHistoryDetailSerializer(
        many=True, source="psteststephistory_set", read_only=True
    )
    owner = MyUserShortSerializer(read_only=True)

    def get_mse(self, obj: PSTestHistory) -> float:
        return obj.get_mse()
