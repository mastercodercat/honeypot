# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-20 02:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_userconfig'),
    ]

    operations = [
        migrations.AddField(
            model_name='userconfig',
            name='email',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
