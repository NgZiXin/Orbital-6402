# Generated by Django 5.0.6 on 2024-07-25 09:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_calendar', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendar',
            name='end_time',
            field=models.CharField(default='1000', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='calendar',
            name='start_time',
            field=models.CharField(default='0800', max_length=10),
            preserve_default=False,
        ),
    ]
