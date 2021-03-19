from django.contrib import admin
from django.template.defaultfilters import truncatechars
from django.utils.translation import gettext as _
from tests_engine.models import Category, PSTest, PSTestStep


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name_en", "name_ukr")
    fields = ("id", "name_en", "name_ukr", "created", "updated")
    readonly_fields = ("id", "created", "updated")


class PSTestStepInline(admin.TabularInline):
    model = PSTestStep


@admin.register(PSTest)
class PSTestAdmin(admin.ModelAdmin):
    inlines = (PSTestStepInline,)
    list_display = (
        "id",
        "name",
        "short_description",
        "language",
        "category",
        "owner",
        "normal_mse",
        "updated",
        "created",
    )
    fields = (
        "id",
        "name",
        "language",
        "category",
        "description",
        "owner",
        "normal_mse",
        "updated",
        "created",
    )
    readonly_fields = ("id", "created", "updated")
    list_filter = (
        "language",
        "category",
        "owner",
        "updated",
        "created",
    )
    search_fields = (
        "id",
        "name",
        "description",
        "normal_mse",
    )

    def short_description(self, obj):
        return truncatechars(obj.description, 35)

    short_description.admin_order_field = "description"
    short_description.short_description = _("Description")


@admin.register(PSTestStep)
class PSTestStepAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ps_test",
        "media_type",
        "media_file",
        "min_pulse",
        "max_pulse",
        "duration",
        "short_help_text",
    )
    list_filter = (
        "ps_test",
        "ps_test__owner",
        "media_type",
    )
    search_fields = (
        "media_file",
        "min_pulse",
        "max_pulse",
        "duration",
        "help_text",
    )

    def short_help_text(self, obj):
        return truncatechars(obj.help_text, 35)

    short_help_text.admin_order_field = "help_text"
    short_help_text.short_description = _("Help Text")
