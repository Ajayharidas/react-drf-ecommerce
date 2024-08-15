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
        if not self.slug:
            if self.parent:
                full_name = f"{self.parent.name} {self.name}"
            else:
                full_name = self.name
            self.slug = slugify(full_name).replace("-", "+")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
