from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = ['id', 'owner', 'name', 'address', 'description', 'created_at', 'qr_code_url']
        read_only_fields = ['id', 'owner', 'created_at', 'qr_code_url']

    def get_qr_code_url(self, obj):
        request = self.context.get('request')
        if obj.qr_code and request:
            return request.build_absolute_uri(obj.qr_code.url)
        return None
