from django.db import models
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files import File

class Shop(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shops'
    )
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    qr_code = models.ImageField(upload_to='qr_codes', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        creating = self.pk is None
        super().save(*args, **kwargs)  # Sauvegarde initiale pour avoir un ID

        if creating and not self.qr_code:
            # Génération du QR code avec l’URL de la boutique
            qr_content = f'http://127.0.0.1:8000/shops/{self.id}'

            qr_img = qrcode.make(qr_content)
            canvas = BytesIO()
            qr_img.save(canvas, 'PNG')
            canvas.seek(0)

            self.qr_code.save(f'qr_code_{self.id}.png', File(canvas), save=False)
            super().save(update_fields=['qr_code'])
