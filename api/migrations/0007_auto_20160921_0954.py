# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-21 09:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_event_node'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='node',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Node'),
        ),
    ]
