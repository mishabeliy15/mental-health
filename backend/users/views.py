import shutil
import subprocess
from django.contrib import messages
from django.core import management
from django.http import HttpResponseRedirect
from rest_framework.views import APIView


class BackupView(APIView):
    def get(self, request, format=None):
        management.call_command("dbbackup", "--noinput")
        messages.success(request, "Backup hash been successful created.")
        return HttpResponseRedirect(redirect_to="/admin/")


class RestoreView(APIView):
    def get(self, request, format=None):
        management.call_command("dbrestore", "--noinput")
        messages.success(request, "Database hash been successful restored.")
        return HttpResponseRedirect(redirect_to="/admin/")


class UpdateCertView(APIView):
    def get(self, request, format=None):
        code = subprocess.call("/usr/certs/init_cert.sh")
        if code == 0:
            messages.success(request, "SSL certificate hash been successful updated.")
            base_dir = "/usr/src/app"
            for cert in ("localhost.crt", "localhost.key"):
                shutil.move(f"{base_dir}/{cert}", f"/usr/certs/{cert}")
        else:
            messages.error(request, f"Can't update cert.\nReturn code: {code}")
        return HttpResponseRedirect(redirect_to="/admin/")
