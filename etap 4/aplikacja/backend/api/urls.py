from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'photos', views.PublicPhotos, basename="Photos")

urlpatterns = [
    path('api/', views.index, name='index'),
    path('api/get_photo/<int:id>', views.getPhoto, name='get_photo'),
    path('api/get_comments/<int:photo_id>', views.getComments, name='get_comments'),
    path('api/get_user_photos/<int:user_id>', views.getUserPhotos, name='get_user_photos'),
    path('api/albums/<int:user_id>', views.getUserAlbums, name='get_user_albums'),
    path('api/get_user_info/<int:user_id>', views.getUserInfo, name='get_user_info'),
    path('api/upload_photo', views.uploadPhoto, name='upload_photo'),
    path('api/add_album', views.addAlbum, name='add_album'),
    path('api/add_comment/<int:photo_id>', views.addComment, name='add_comment'),
    path('api/photo_favourite/<int:photo_id>/<int:user_id>', views.isPhotoFavourite, name='photo_favourite'),
    path('api/manage_favourite/<int:photo_id>/<int:user_id>/<int:favourite>', views.manageFavourite, name='manage_favourite'),
    path('api/photos/by_criterium/<str:criterium>/<str:value>', views.getPhotosByCriterium, name='photo_by_criterium'),
    path('api/delete_photo/<int:id>', views.deletePhoto, name='delete_photo'),
    path('api/edit_photo/<int:photo_id>', views.editPhoto, name='edit_photo'),
    path('api/photos_by_album/<int:album_id>', views.getPhotosByAlbum, name='photos_by_album'),
    path('api/edit_album/<int:album_id>', views.editAlbum, name='edit_album'),
    # path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/login', views.login_user, name='login'),
    path('api/register', views.register_user, name='register'),
    path('api/login_user', views.LoginView.as_view()),
    path('api/logout', views.LogoutView.as_view(), name='logout_user')
]