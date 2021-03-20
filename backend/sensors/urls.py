from rest_framework.routers import DefaultRouter
from sensors.views import PulseRecordViewSet

app_name = "sensors"

router = DefaultRouter()
router.register("pulse_record", PulseRecordViewSet)


urlpatterns = router.urls
