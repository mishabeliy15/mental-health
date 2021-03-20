from django.contrib import admin
from tests_history.models import PSTestHistory, PSTestStepHistory


class PSTestStepHistoryInline(admin.TabularInline):
    model = PSTestStepHistory


@admin.register(PSTestHistory)
class PSTestHistoryAdmin(admin.ModelAdmin):
    inlines = (PSTestStepHistoryInline,)
    list_display = (
        "id",
        "test",
        "status",
        "owner",
        "created",
        "updated",
    )
    list_filter = (
        "test",
        "status",
        "owner",
        "created",
        "updated",
    )
    search_fields = ("test",)


@admin.register(PSTestStepHistory)
class PSTestStepHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "test_history",
        "step",
        "started_at",
        "ended_at",
    )
    list_filter = (
        "test_history",
        "step",
        "started_at",
        "ended_at",
    )
