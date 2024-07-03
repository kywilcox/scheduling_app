# Generated by Django 5.0.6 on 2024-07-01 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('account_id', models.AutoField(primary_key=True, serialize=False)),
                ('account_name', models.CharField(max_length=255)),
                ('admin_first_name', models.CharField(max_length=255)),
                ('admin_last_name', models.CharField(max_length=255)),
                ('admin_email', models.EmailField(max_length=254, unique=True)),
                ('admin_password', models.CharField(max_length=255)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
