# Generated by Django 3.1.3 on 2021-03-19 22:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.expressions


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tests_engine', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='pstest',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Owner'),
        ),
        migrations.AddConstraint(
            model_name='psteststep',
            constraint=models.CheckConstraint(check=models.Q(min_pulse__lte=django.db.models.expressions.F('max_pulse')), name='Min pulse must be <= max price.'),
        ),
    ]
