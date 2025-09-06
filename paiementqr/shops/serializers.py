from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'owner', 'name', 'address', 'description', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']
