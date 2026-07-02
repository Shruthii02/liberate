from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ReceiverProfile
from .receiver_serializers import ReceiverProfileSerializer


class ReceiverProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        if request.user.role != 'RECEIVER':
            return Response(
                {'detail': 'Only receivers can access this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            profile = request.user.receiver_profile
        except ReceiverProfile.DoesNotExist:
            return Response(
                {'detail': 'Receiver profile not found. Please complete your profile.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ReceiverProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        return self._save(request, partial=False)

    def patch(self, request):
        return self._save(request, partial=True)

    def post(self, request):
        return self._save(request, partial=False)

    def _save(self, request, partial):
        if request.user.role != 'RECEIVER':
            return Response(
                {'detail': 'Only receivers can update this profile.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            profile = request.user.receiver_profile
            serializer = ReceiverProfileSerializer(
                profile,
                data=request.data,
                partial=partial,
                context={'request': request},
            )
            created = False
        except ReceiverProfile.DoesNotExist:
            serializer = ReceiverProfileSerializer(
                data=request.data,
                partial=partial,
                context={'request': request},
            )
            created = True

        if serializer.is_valid():
            if created:
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
