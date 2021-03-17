from rest_framework.routers import DefaultRouter
from tests_engine.views import CategoryViewSet, PSTestStepViewSet, PSTestViewSet

app_name = "tests_engine"

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("ps_test", PSTestViewSet)
router.register("ps_test_step", PSTestStepViewSet)

urlpatterns = router.urls
