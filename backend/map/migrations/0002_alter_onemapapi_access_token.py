# Generated by Django 5.0.6 on 2024-06-22 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='onemapapi',
            name='access_token',
            field=models.CharField(),
        ),
    ]