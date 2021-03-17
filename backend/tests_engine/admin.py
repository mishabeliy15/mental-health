from django.contrib import admin
from tests_engine.models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name_en", "name_ukr")
    fields = ("name_en", "name_ukr", "created", "updated")
    readonly_fields = ("created", "updated")
