from rest_framework import serializers

from . import models


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = "__all__"


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Photo
        fields = "__all__"


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Album
        fields = "__all__"
