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
    qr_code = models.ImageField(upload_to='qr_codes', blank=True, null=True)  # champ image QR
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Générer QR code avant sauvegarde si pas existant
        if not self.qr_code:
            qrcode_img = qrcode.make(f'http://127.0.0.1:8000/shops/{self.id}')
            canvas = BytesIO()
            qrcode_img.save(canvas, 'PNG')
            canvas.seek(0)
            self.qr_code.save(f'qr_code_{self.id}.png', File(canvas), save=False)
        super().save(*args, **kwargs)
