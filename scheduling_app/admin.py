from django.contrib import admin
from .models import Account, CustomField, CustomUser, UserType

admin.site.register(Account)
admin.site.register(CustomField)
admin.site.register(CustomUser)
admin.site.register(UserType)
