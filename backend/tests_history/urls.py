from rest_framework.routers import DefaultRouter
from tests_history.views import PSTestHistoryViewSet, PSTestStepHistoryViewSet

app_name = "tests_history"

router = DefaultRouter()
router.register("ps_test_history", PSTestHistoryViewSet)
router.register("ps_test_step_history", PSTestStepHistoryViewSet)

urlpatterns = router.urls
