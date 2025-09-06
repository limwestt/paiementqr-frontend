from django.urls import path
from .views import ShopListCreateView

urlpatterns = [
    path('shops/', ShopListCreateView.as_view(), name='shop-list-create'),
]
