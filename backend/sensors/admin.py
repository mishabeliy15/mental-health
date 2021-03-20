from django.contrib import admin
from sensors.models import PulseRecord


@admin.register(PulseRecord)
class PulseRecordAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "test_step",
        "pulse",
        "created",
        "updated",
    )
    list_filter = (
        "test_step",
        "created",
        "updated",
    )
