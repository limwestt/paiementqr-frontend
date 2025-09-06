from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Pour l’instant, on hérite du modèle utilisateur standard
    # Plus tard, on pourra ajouter les champs spécifiques (ex: wallet, points fidélité)
    pass
