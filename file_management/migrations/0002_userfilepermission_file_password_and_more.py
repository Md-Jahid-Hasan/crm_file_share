# Generated by Django 4.0 on 2022-01-06 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authenticateUser', '0001_initial'),
        ('file_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfilepermission',
            name='file_password',
            field=models.CharField(default='abc', max_length=10),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='file',
            unique_together={('user', 'name')},
        ),
    ]
