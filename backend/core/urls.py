from django.urls import path, include

from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("tags", views.TagMVS)
router.register("photos", views.PhotoMVS)
router.register("albums", views.AlbumMVS)


urlpatterns = [
    path("", include(router.urls)),
]
