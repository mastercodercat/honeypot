# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-21 09:48
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_node_api_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='node',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Node'),
        ),
    ]
