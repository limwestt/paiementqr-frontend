from rest_framework import generics, permissions
from .models import Shop
from .serializers import ShopSerializer

class ShopListCreateView(generics.ListCreateAPIView):
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Affiche uniquement les boutiques de l'utilisateur connecté
        return Shop.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
