# Generated by Django 3.1.3 on 2021-03-19 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tests_history', '0002_auto_20210320_0024'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='psteststephistory',
            options={'ordering': ('started_at',)},
        ),
        migrations.AlterField(
            model_name='psteststephistory',
            name='started_at',
            field=models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Started at'),
        ),
    ]
