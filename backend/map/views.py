from django.shortcuts import render


def index(request):
    context = {
         # For future TODO
    }
    return render(request, "index.html", context)
