from django.contrib import admin
from django.urls import path, include
from games import views
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("games.urls")),



    path('password-reset/',auth_views.PasswordResetView.as_view(template_name='games/password_reset.html'),name='password_reset'),

    path('password-reset/done/',auth_views.PasswordResetDoneView.as_view(template_name='games/password_reset_done.html'),name='password_reset_done'),

    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='games/password_reset_confirm.html'),name='password_reset_confirm'),

    path('reset/done/',auth_views.PasswordResetCompleteView.as_view(template_name='games/password_reset_complete.html'),name='password_reset_complete'),
]

# Solo en DEBUG: servir media local de forma temporal/legacy.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
