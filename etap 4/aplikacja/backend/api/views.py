from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import Photo, Favourite, Comment, Album, Tag
from django.core import serializers
from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers.serializers import PhotoSerializer, UserSerializer, CommentSerializer, AlbumSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import jwt, datetime
from django.utils.decorators import method_decorator
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.db import transaction, DatabaseError
from .utils.AzureStorageProvider import AzureStorageProvider
import importlib
StorageBlob = importlib.import_module("azure.storage.blob")
# Create your views here.


class PublicPhotos(viewsets.ModelViewSet):

    serializer_class = PhotoSerializer

    def get_object(self, queryset=None, **kwargs):
        item = self.kwargs.get('pk')
        return get_object_or_404(Photo, slug=item)

    def get_queryset(self):
        return Photo.objects.filter(public=True)


class FavouritePhotos(viewsets.ModelViewSet):

    serializer_class = PhotoSerializer

    def get_object(self, queryset=None, **kwargs):
        item = self.kwargs.get('pk')
        return get_object_or_404(Photo, slug=item)

    def get_queryset(self):
        return Photo.objects.filter(public=True)

@csrf_exempt
def getPhotosByCriterium(request, criterium, value):
    search_type = '__username' if criterium == 'author' else '__name' if criterium == 'tag' else ''

    photos = Photo.objects.filter(**{criterium+search_type + '__contains': value})

    if photos.count() == 0:
        return JsonResponse({
            'status_code': 404,
            'message': "Nie znaleziono zdjęć o podanych parametrach."
        })

    photosResponse = PhotoSerializer(photos, many=True).data

    return JsonResponse({
        'status_code': 200,
        'photos': photosResponse
    }, safe=False)


def getUserPhotos(request, user_id):

    user = User.objects.get(id=user_id)
    filters = {"author": user}
    token = request.COOKIES.get('jwt')
    if token:
        payload = jwt.decode(jwt=token, key='secret', algorithms=['HS256'])
        if payload['id'] != user_id:
            filters.update({"public": True})

    allPtohosRaw = Photo.objects.filter(**filters)

    # if allPtohosRaw.count() == 0:
    #     response = JsonResponse({"message": "Użytkownik " + user.username + " nie posiada żadnych zdjęć."})
    #     response.status_code = 404
    #
    #     return response

    allPhotos = PhotoSerializer(allPtohosRaw, many=True)

    return JsonResponse({'photos': allPhotos.data}, safe=False)


def getUserAlbums(request, user_id):

    user = User.objects.get(id=user_id)
    filters = {"author": user}

    albumsRaw = Album.objects.filter(**filters)
    albums = AlbumSerializer(albumsRaw, many=True)

    return JsonResponse({'albums': albums.data}, safe=False)


def index(request):

    allPtohosRaw = Photo.objects.filter(public=True).order_by('-id')
    favouritePhotos = None

    token = request.COOKIES.get('jwt')

    if token:
        payload = jwt.decode(jwt=token, key='secret', algorithms=['HS256'])
        favouritePhotosID = Favourite.objects.filter(user=payload['id']).values_list('photo')
        favouritePhotosRaw = Photo.objects.filter(id__in=favouritePhotosID)
        if favouritePhotosRaw:
            favouritePhotos = PhotoSerializer(favouritePhotosRaw, many=True).data

    else:
        print("user not authenticated")

    allPhotos = PhotoSerializer(allPtohosRaw, many=True)

    return JsonResponse({'photos': allPhotos.data, 'favouritePhotos': favouritePhotos}, safe=False)


@csrf_exempt
def login_user(request):

    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == 'POST':

        username, password = request.POST['login'], request.POST['password']

        user = authenticate(username=username, password=password)
        print(username, password)
        if user is not None:
            login(request, user)
            responseUser = UserSerializer(user)
            print(user.email)

            return JsonResponse(responseUser.data, safe=False)
        else:
            return JsonResponse({"message": "user not found"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
def register_user(request):
    try:

        user = User(username=request.POST['login'], email=request.POST['email'])
        user.set_password(request.POST['password'])
        user.save()

        return JsonResponse({'status_code': 200})

    except Exception as e:
        response = JsonResponse({'message': "Nie można utworzyć użytkownika +" + str(e)})
        response.status_code = 500

        return response


def getComments(request, photo_id):
    try:
        comments = Comment.objects.filter(photo__id=photo_id)
        commentsResponse = CommentSerializer(comments, many=True).data
        return JsonResponse({'comments': commentsResponse})

    except ObjectDoesNotExist:

        return JsonResponse({
            'status_code': 404,
            'error': 'Nie znaleziono zdjęcia o podanych parametrach'
        })


@csrf_exempt
def addComment(request, photo_id):
    print(request.POST['user_id'], request.POST['comment'])
    photo = Photo.objects.get(id=photo_id)
    user = User.objects.get(id=request.POST['user_id'])
    comment = Comment(comment=request.POST['comment'], photo=photo, user=user)
    comment.save()

    return JsonResponse({
        'status_code': 200,
        'message': "Komentarz dodany pomyślnie"
    })


def manageFavourite(request, photo_id, user_id, favourite):

    if favourite == 1:
        photo = Photo.objects.get(id=photo_id)
        user = User.objects.get(id=user_id)
        favourite = Favourite(photo=photo, user=user)
        favourite.save()
        return JsonResponse({
            'status_code': 200,
            'message': "Zdjecie dodano do ulubionych."
        })
    else:
        fav = Favourite.objects.get(user__id=user_id, photo__id=photo_id)
        fav.delete()
        return JsonResponse({
            'status_code': 200,
            'message': "Zdjecie odznaczono z ulubionych"
        })


def isPhotoFavourite(request, photo_id, user_id):
    photo = Photo.objects.get(id=photo_id)
    user = User.objects.get(id=user_id)

    favourite = Favourite.objects.filter(user=user, photo=photo).count()

    return JsonResponse(True if favourite > 0 else False, safe=False)


def getPhoto(request, id):

    try:
        photo = Photo.objects.get(id=id)
        photoParsed = PhotoSerializer(photo, many=False).data

    except Photo.DoesNotExist:
        response = JsonResponse({"message": "Nie znaleziono zdjęcia."})
        response.status_code = 404

        return response

    return JsonResponse({'photo': photoParsed})


class LoginView(APIView):
    def post(self, request):
        username = request.data['login']
        password = request.data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            payload = {
                'id': user.id,
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=3600),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')

            response = Response()

            response.set_cookie(key='jwt', value=token, httponly=True)

            response.data = {
                'jwt': token,
                'username': user.username,
                'userId': user.id
            }

            return response

        response = JsonResponse({"message": "Wystąpił błąd w trakcie logowania."})
        response.status_code = 500

        return response


class LogoutView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if token:
            response = Response()
            response.delete_cookie('jwt')
            response.status_code = 200

            return response

        response = JsonResponse({"message": "Wystąpił problem z wylogowaniem użytkownika"})
        response.status_code = 500

        return response


@csrf_exempt
def uploadPhoto(request):
    tags = request.POST['tags'].split(', ')
    try:
        with transaction.atomic():

            user = User.objects.get(id=request.POST['user_id'])
            photo = Photo(photo=request.POST['name'] + ".jpg", title=request.POST['name'], description=request.POST['description'], author=user, public=True, deleted=False, width=1000, height=1000)
            photo.save()

            # handle tags
            for tag in tags:
                if tag != '':
                    existingTag = Tag.objects.filter(name=tag)
                    if existingTag.count() == 0:
                        existingTag = Tag(name=tag)
                        existingTag.save()
                        photo.tag.add(existingTag)
                    else:
                        photo.tag.add(existingTag[0])

            # handle albums
            if request.POST['selectedAlbum'] != '' or request.POST['newAlbum'] != '':
                if request.POST['selectedAlbum'] != '':
                    album = Album.objects.get(id=request.POST['selectedAlbum'])
                else:
                    album = Album(name=request.POST['newAlbum'], author=user)
                    album.save()

                photo.album.add(album)

            # upload to azure storage

            AzureStorageProvider().addBlob(request.POST['name'], request.FILES['photo'])

            return JsonResponse({'status_code': 200, 'message': 'Zdjęcie dodano pomyślnie'})

    except Exception as e:
        response = JsonResponse({'message': "Wystapił problem ze wstawianiem zdjęcia: " + str(e)})
        response.status_code = 500
        print(e)
        return response

@csrf_exempt
def addAlbum(request):
    name = request.POST['name']
    description = request.POST['description']
    user_id = request.POST['user_id']

    try:
        user = User.objects.get(id=user_id)

        album = Album(name=name, description=description, author=user)
        album.save()

        return JsonResponse({'status_code': 200, 'message': "Album został dodany pomyślnie"})

    except DatabaseError as e:

        response = JsonResponse({'message': "Wystąpił błąd przy tworzeniu albumu"})
        response.status_code = 500

        return response


def deletePhoto(request, id):
    try:
        print(id)
        photo = Photo.objects.get(id=id)
        photo.delete()

        AzureStorageProvider().removeBlob(photo.photo)

        return JsonResponse({'message': "Zdjęcie usunięto pomyślnie."})

    except Exception as e:
        response = JsonResponse("Wystąpił błąd przy usuwaniu błędu.")
        response.status_code = 500

        return response


@csrf_exempt
def editPhoto(request, photo_id):
    photo = Photo.objects.get(id=photo_id)
    user = User.objects.get(id=request.POST['user_id'])

    # handle tags
    tags = request.POST['tags'].split(', ')

    with transaction.atomic():
        photo.tag.clear()
        if tags != ['']:
            for tag in tags:
                existingTag = Tag.objects.filter(name=tag)
                if existingTag.count() == 0:
                    existingTag = Tag(name=tag)
                    existingTag.save()
                    photo.tag.add(existingTag)
                else:
                    photo.tag.add(existingTag[0])

        # handle album
        photo.album.clear()
        if request.POST['selectedAlbum'] != '' or request.POST['newAlbum'] != '':
            if request.POST['selectedAlbum'] is not None:
                album = Album.objects.get(id=request.POST['selectedAlbum'])
            else:
                album = Album(name=request.POST['newAlbum'], author=user)
                album.save()

            photo.album.add(album)

        photo.description = request.POST['description']
        photo.title = request.POST['name']

        photo.save()

        return JsonResponse({"message": "Zmiany zostały zapisane pomyślnie."})


def getPhotosByAlbum(request, album_id):
    album = Album.objects.get(id=album_id)
    user = album.author

    photos = Photo.objects.filter(album=album)
    photosRes = PhotoSerializer(photos, many=True).data
    author = UserSerializer(user, many=False).data

    albumRes = AlbumSerializer(album, many=False).data

    return JsonResponse({"photos": photosRes, "author": author, "album": albumRes}, safe=False)

@csrf_exempt
def editAlbum(request, album_id):
    name = request.POST['name']
    description = request.POST['description']
    photosToDelete = request.POST['photosToDelete']

    album = Album.objects.get(id=album_id)

    if photosToDelete != '':
        for photo_id in photosToDelete.split(','):
            photo = Photo.objects.get(id=photo_id)
            photo.album.remove(album)

    album.name = name
    album.description = description
    album.save()

    return JsonResponse({'message': "Album zmodyfikowany prawidłowo."})


def getUserInfo(self, user_id):
    user = User.objects.get(id=user_id)

    userPublications = Photo.objects.filter(author=user).count()
    userRes = UserSerializer(user, many=False).data

    return JsonResponse({'user': userRes, "userPublications": userPublications})
