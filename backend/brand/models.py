from django.db import models
from django.template.defaultfilters import slugify


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(blank=True)
    logo = models.ImageField(upload_to="logos/")
    description = models.TextField()
    website_url = models.URLField(max_length=200)
    email = models.EmailField(max_length=250, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    established_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
