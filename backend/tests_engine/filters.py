from dry_rest_permissions.generics import DRYPermissionFiltersBase


class BaseMyOwnFilterBackend(DRYPermissionFiltersBase):
    action_routing = True

    def filter_list_queryset(self, request, queryset, view):
        return queryset

    def filter_my_queryset(self, request, queryset, view):
        return queryset.filter(owner=request.user)
