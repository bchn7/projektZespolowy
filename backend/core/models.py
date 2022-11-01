from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


class PhotoMeta(models.Model):
    width = models.IntegerField(blank=True)
    height = models.IntegerField(blank=True)


class Photo(models.Model):
    photo = models.ImageField()
    description = models.TextField(max_length=300, blank=True)
    tags = models.ForeignKey(Tag, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    favourite = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    deleted_date = models.DateTimeField(null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    meta = models.OneToOneField(PhotoMeta, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.author} at {self.created}"


class Album(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    photos = models.ManyToManyField(Photo)

    def __str__(self):
        return self.name
