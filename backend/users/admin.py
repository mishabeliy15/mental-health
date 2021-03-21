from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from .models import InviteToContact, User


class InviteToContactInline(admin.TabularInline):
    model = InviteToContact
    fk_name = "to_user"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (InviteToContactInline,)
    list_display = (
        "id",
        *BaseUserAdmin.list_display,
        "user_type",
        "date_of_birthday",
        "sex",
        "avatar",
        "last_step",
    )

    list_filter = (
        *BaseUserAdmin.list_filter,
        "user_type",
        "sex",
        "last_step",
    )

    readonly_fields = (
        "id",
        *BaseUserAdmin.readonly_fields,
        "user_type",
    )

    fieldsets = (
        *BaseUserAdmin.fieldsets,
        (
            _("Other"),
            {
                "fields": (
                    "user_type",
                    "date_of_birthday",
                    "sex",
                    "avatar",
                    "last_step",
                    "contacts",
                )
            },
        ),
    )


@admin.register(InviteToContact)
class InviteToContactAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "from_user",
        "to_user",
        "updated",
        "created",
    )
    readonly_fields = ("id", "created", "updated")
    list_filter = (
        "status",
        "from_user",
        "to_user",
        "updated",
        "created",
    )
    search_fields = (
        "id",
        "from_user__first_name",
        "from_user__last_name",
        "to_user__first_name",
        "to_user__last_name",
        "from_user__username",
        "to_user__username",
    )


# Text to put at the end of each page's <title.>
admin.site.site_title = _("Mental-Health")

# Text to put in each page's <h1>.
admin.site.site_header = _("Mental-Health Administration")

# Text to put at the top of the admin index page.
admin.site.index_title = _("Mental-Health")
