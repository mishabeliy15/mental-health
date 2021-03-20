from rest_framework import serializers
from sensors.models import PulseRecord


class PulseRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PulseRecord
        fields = "__all__"
        read_only_fields = ("test_step",)
