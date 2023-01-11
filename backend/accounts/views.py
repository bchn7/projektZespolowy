from django.contrib.auth.models import User

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


from .serializers import UserSerializer


@api_view(["POST"])
def logout_view(request):
    if request.method == "POST":
        if not hasattr(request.user, "auth_token"):
            return Response({"status": "Token is missing"}, 401)
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
