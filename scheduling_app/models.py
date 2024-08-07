from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    account_name = models.CharField(max_length=255)
    admin_first_name = models.CharField(max_length=255)
    admin_last_name = models.CharField(max_length=255)
    admin_email = models.EmailField(unique=True)
    admin_password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.account_name

class CustomField(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50)
    required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.field_name} ({self.field_type})"

class UserType(models.Model):
    user_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CustomUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    primary_email = models.EmailField(unique=True)
    secondary_email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=255)
    permissions = models.CharField(max_length=255)
    professional_suffix = models.CharField(max_length=255, blank=True, null=True)
    npi = models.CharField(max_length=20, blank=True, null=True)
    mobile_phone = models.CharField(max_length=20, blank=True, null=True)
    pager = models.CharField(max_length=20, blank=True, null=True)
    schedule_name = models.CharField(max_length=255)
    custom_fields = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user_type})"

class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    location_name = models.CharField(max_length=255)
    location_abbreviation = models.CharField(max_length=50)
    location_address = models.CharField(max_length=255)
    location_address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    created_by = models.ForeignKey(User, related_name='location_creators', on_delete=models.SET_NULL, null=True)
    updated_by = models.ForeignKey(User, related_name='location_updaters', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.location_name

class Assignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    assignment_name = models.CharField(max_length=255)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    days_of_week = models.JSONField(default=list)
    weekend_days = models.JSONField(default=list)
    is_night = models.BooleanField(default=False)
    min_slots = models.PositiveIntegerField(default=0)
    max_slots = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, related_name='assignment_creators', on_delete=models.SET_NULL, null=True)
    updated_by = models.ForeignKey(User, related_name='assignment_updaters', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.assignment_name
