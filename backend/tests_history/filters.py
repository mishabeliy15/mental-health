from dry_rest_permissions.generics import DRYPermissionFiltersBase


class PSTestHistoryFilter(DRYPermissionFiltersBase):
    action_routing = True

    def filter_list_queryset(self, request, queryset, view):
        if request.user.user_type == request.user.UserType.CLIENT:
            queryset = queryset.filter(owner=request.user)
        return queryset
