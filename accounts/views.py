from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import RegisterSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'email': user.email,
                'phone': user.phone,
            }
        )


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors)