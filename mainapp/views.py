from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string

from mainapp.models import Movie
from mainapp.forms import MovieCreateForm


def main(request):
    list = Movie.objects.all().order_by('?')[:4]
    content = {
        'title': 'главная',
        'list': list,
    }
    return render(request, 'mainapp/index.html', content)


def api(request):
    data_list = []
    movies = Movie.objects.all()
    for id, movie in enumerate(movies):
        content = dict()
        content['idx'] = movie.id
        content['title'] = movie.title
        content['description'] = movie.description
        content['year'] = movie.year
        content['country'] = movie.country
        content['budget'] = movie.budget
        data_list.append(content)

    return JsonResponse(data_list, safe=False)


def create(request):
    data = dict()
    if request.is_ajax():
        form = MovieCreateForm(request.POST)
        if form.is_valid():
            form.save()
            title = form.data.get('title')
            movie = Movie.objects.get(title=title)
            data['success'] = True
            data['idx'] = movie.id
        else:
            data['success'] = False
    else:
        data['success'] = False
    return JsonResponse(data)


def remove(request):
    pk = request.POST.get('idx')
    movie = Movie.objects.get(id=pk)

    movie.delete()

    return JsonResponse({'success': True})


def update(request):
    pk = request.POST.get('idx')
    title = request.POST.get('title')
    description = request.POST.get('description')
    year = request.POST.get('year')
    country = request.POST.get('country')
    budget = request.POST.get('budget')

    movie = Movie.objects.get(id=pk)

    movie.title = title
    movie.description = description
    movie.year = year
    movie.country = country
    movie.budget = budget

    movie.save()

    return JsonResponse({'success': True})
