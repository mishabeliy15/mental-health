from django.urls import path

from .views import BackupView, RestoreView, UpdateCertView

app_name = "management"

urlpatterns = [
    path("backup/", BackupView.as_view(), name="backup"),
    path("restore/", RestoreView.as_view(), name="restore"),
    path("update-cert/", UpdateCertView.as_view(), name="update-cert"),
]
