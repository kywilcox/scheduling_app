# Generated by Django 5.0.6 on 2024-07-25 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scheduling_app', '0006_rename_user_customuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
