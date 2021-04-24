from django import forms

from mainapp.models import Movie


class MovieCreateForm(forms.ModelForm):

    class Meta:
        model = Movie
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MovieCreateForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = "product-form-input"

