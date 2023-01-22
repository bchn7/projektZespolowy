from rest_framework import serializers
from ..models import Photo, Tag, Comment, Album
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.authtoken.models import Token
from rest_framework.validators import ValidationError


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class AlbumSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Album


class PhotoSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)
    tag = TagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    album = AlbumSerializer(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = '__all__'








