# Generated by Django 3.2.7 on 2023-01-11 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20230111_2020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='deleted',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='photo',
            name='deleted_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
