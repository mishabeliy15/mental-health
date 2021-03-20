# Generated by Django 3.1.3 on 2021-03-19 22:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tests_engine', '0002_auto_20210320_0024'),
        ('tests_history', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pstesthistory',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Owner'),
        ),
        migrations.AddField(
            model_name='pstesthistory',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests_engine.pstest', verbose_name='Test'),
        ),
    ]
