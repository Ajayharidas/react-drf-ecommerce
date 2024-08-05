from django.conf import settings
from functools import wraps


def modify_token_view_decorator(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.method == "POST":
            request.POST = request.POST.copy()
            request.POST["client_id"] = settings.CLIENT_ID
            request.POST["client_secret"] = settings.CLIENT_SECRET
            return view_func(request, *args, **kwargs)

    return _wrapped_view
