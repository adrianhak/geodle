# Generated by Django 4.0.5 on 2022-07-05 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_guess_delete_gameresult'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guess',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
