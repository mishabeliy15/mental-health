import datetime

from django_filters.rest_framework import DjangoFilterBackend
from dry_rest_permissions.generics import DRYPermissions
from rest_framework.filters import SearchFilter
from rest_framework.mixins import CreateModelMixin
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from tests_history.filters import PSTestHistoryFilter
from tests_history.models import PSTestHistory, PSTestStepHistory
from tests_history.serializers import (
    PSTestHistoryDetailSerializer,
    PSTestHistoryListSerializer,
    PSTestStepHistoryBaseSerializer,
    PSTestHistoryBaseSerializer,
)


class PSTestHistoryViewSet(ModelViewSet):
    queryset = PSTestHistory.objects.select_related("test", "owner")
    serializer_class = PSTestHistoryListSerializer
    filter_backends = (PSTestHistoryFilter, DjangoFilterBackend, SearchFilter)
    permission_classes = (DRYPermissions,)
    filterset_fields = (
        "id",
        "test",
        "status",
        "test__language",
        "test__category",
        "owner",
        "created",
        "updated",
    )
    search_fields = (
        "test__name",
        "test__description",
    )

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(owner=user)
        if user.last_step:
            test_history = user.last_step.test_history
            if test_history.status == test_history.PSTestHistoryStatus.IN_PROGRESS:
                test_history.status = test_history.PSTestHistoryStatus.NOT_COMPLETED
                test_history.save(update_fields=("status",))

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PSTestHistoryDetailSerializer
        elif self.action == "create":
            return PSTestHistoryBaseSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "retrieve":
            queryset = queryset.prefetch_related(
                "psteststephistory_set",
                "psteststephistory_set__step",
                "psteststephistory_set__pulserecord_set",
            )
        return queryset


class PSTestStepHistoryViewSet(CreateModelMixin, GenericViewSet):
    queryset = PSTestStepHistory.objects.select_related("test_history", "step")
    serializer_class = PSTestStepHistoryBaseSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    permission_classes = (DRYPermissions,)
    filterset_fields = (
        "id",
        "owner",
        "created",
        "updated",
    )
    search_fields = (
        "name",
        "description",
    )

    def perform_create(self, serializer):
        now = datetime.datetime.now(tz=datetime.timezone.utc)
        data = serializer.validated_data
        duration = datetime.timedelta(seconds=data["step"].duration)
        ended_at = now + duration
        obj = serializer.save(ended_at=ended_at)
        self.request.user.last_step = obj
        self.request.user.save(update_fields=("last_step",))
