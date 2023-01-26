# Generated by Django 3.2.7 on 2023-01-11 19:14

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("core", "0002_auto_20221103_1915"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="photo",
            name="meta",
        ),
        migrations.AddField(
            model_name="album",
            name="favourite",
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="photo",
            name="height",
            field=models.IntegerField(blank=True, default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="photo",
            name="width",
            field=models.IntegerField(blank=True, default=1),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name="PhotoMeta",
        ),
    ]