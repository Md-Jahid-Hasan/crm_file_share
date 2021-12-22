from django.contrib import admin
from .models import User, UserPaymentAccount


admin.site.register(User)
admin.site.register(UserPaymentAccount)
