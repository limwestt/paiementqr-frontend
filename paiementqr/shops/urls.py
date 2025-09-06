from django.urls import path
from .views import ShopListCreateView, ShopDetailView

urlpatterns = [
    path('shops/', ShopListCreateView.as_view(), name='shop-list-create'),
    path('shops/<int:pk>/', ShopDetailView.as_view(), name='shop-detail'),
]
