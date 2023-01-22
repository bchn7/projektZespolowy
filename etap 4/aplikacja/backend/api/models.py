from django.db import models
from django.contrib.auth.models import User


class Album(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)


class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)


class Photo(models.Model):
    photo = models.CharField(max_length=100)
    title = models.CharField(max_length=100, default='')
    description = models.TextField()
    public = models.BooleanField()
    deleted = models.BooleanField()
    deleted_date = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)
    author = models.ForeignKey(User, related_name="author", on_delete=models.CASCADE)
    width = models.IntegerField()
    height = models.IntegerField()
    tag = models.ManyToManyField(Tag)
    album = models.ManyToManyField(Album)

# class AlbumPhoto(models.Model):
#     album = models.ForeignKey(Album, on_delete=models.CASCADE)
#     photo = models.ForeignKey(Photo, on_delete=models.CASCADE)


class Favourite(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Plan(models.Model):
    name = models.CharField(max_length=15)
    photos_transfer_limit = models.IntegerField()
    tags_limit = models.IntegerField(null=True)
    folders_limit = models.IntegerField(null=True)


class UserPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    plan_used = models.IntegerField(default=0)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE)
    comment = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True, null=True)


