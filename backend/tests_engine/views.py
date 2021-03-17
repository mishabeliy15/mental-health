from django_filters.rest_framework import DjangoFilterBackend
from dry_rest_permissions.generics import DRYPermissions
from rest_framework.filters import SearchFilter
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.viewsets import ModelViewSet
from tests_engine.models import Category, PSTest, PSTestStep
from tests_engine.serializers import CategorySerializer, PSTestSerializer, \
    PSTestStepSerializer


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (DRYPermissions,)


class PSTestViewSet(ModelViewSet):
    queryset = PSTest.objects.all()
    serializer_class = PSTestSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    permission_classes = (DRYPermissions,)
    filterset_fields = (
        "id",
        "language",
        "category",
        "owner",
        "created",
        "updated",
    )
    search_fields = (
        "name",
        "description",
    )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PSTestStepViewSet(ModelViewSet):
    queryset = PSTestStep.objects.all()
    serializer_class = PSTestStepSerializer
    parser_classes = (MultiPartParser, JSONParser)
    filter_backends = (DjangoFilterBackend, SearchFilter)
    permission_classes = (DRYPermissions,)
    filterset_fields = (
        "id",
        "ps_test",
        "media_type",
        "duration",
        "min_pulse",
        "max_pulse",
        "created",
        "updated",
    )
    search_fields = ("name",)
