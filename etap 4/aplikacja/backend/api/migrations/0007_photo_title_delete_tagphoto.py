# Generated by Django 4.1.4 on 2023-01-15 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_photo_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='title',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.DeleteModel(
            name='TagPhoto',
        ),
    ]