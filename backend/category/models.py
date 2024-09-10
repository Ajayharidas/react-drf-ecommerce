from django.db import models
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import slugify


class Category(models.Model):
    name = models.CharField(_("category"), max_length=150, unique=True)
    slug = models.SlugField(blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subcategories",
    )

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
