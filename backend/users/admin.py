from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        *BaseUserAdmin.list_display,
        "user_type",
    )

    list_filter = (
        *BaseUserAdmin.list_filter,
        "user_type",
    )

    readonly_fields = (
        *BaseUserAdmin.readonly_fields,
        "user_type",
    )

    fieldsets = (*BaseUserAdmin.fieldsets, (None, {"fields": ("user_type",)}))


# Text to put at the end of each page's <title.>
admin.site.site_title = _("Mental-Health")

# Text to put in each page's <h1>.
admin.site.site_header = _("Mental-Health Administration")

# Text to put at the top of the admin index page.
admin.site.index_title = _("Mental-Health")
