import json
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from mainapp.models import Movie

FILE_PATH = os.path.join(settings.BASE_DIR, 'mainapp/json')


def load_from_json(file_name):
    with open(os.path.join(FILE_PATH, file_name + '.json'), encoding="utf-8") as json_file:
        return json.load(json_file)


class Command(BaseCommand):

    def handle(self, *args, **options):

        movies = load_from_json('movies')
        Movie.objects.all().delete()

        for movie in movies:
            Movie.objects.create(**movie)
