from django.db import models


class Movie(models.Model):
    """Фильм"""
    title = models.CharField("Название", max_length=100, unique=True)
    description = models.TextField("Описание")
    year = models.PositiveSmallIntegerField("Дата выхода", default=2019)
    country = models.CharField("Страна", max_length=30)
    budget = models.PositiveIntegerField("Бюджет", default=0,)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Фильм"
        verbose_name_plural = "Фильмы"
