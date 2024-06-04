# Generated by Django 5.0.6 on 2024-06-01 04:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='activity_read_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='activity_write',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='profile_read_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='profile_write',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='read',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='stravaaccesstoken',
            name='read_all',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='stravaaccesstoken',
            name='access_token',
            field=models.CharField(null=True),
        ),
        migrations.AlterField(
            model_name='stravaaccesstoken',
            name='expires_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='stravarefreshtoken',
            name='refresh_token',
            field=models.CharField(null=True),
        ),
    ]