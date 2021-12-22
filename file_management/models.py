import datetime

from django.db import models
from django.contrib.auth import get_user_model as User
from django.utils.text import slugify


def get_upload_path(instance, filename):
    return f"{instance.user.pk}/{filename}"


class File(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    slug = models.SlugField(max_length=100, unique=True)
    content = models.FileField(upload_to=get_upload_path, blank=True, null=True)
    other_link = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=100)
    size = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    is_public = models.BooleanField(default=False)
    price = models.FloatField()
    expire_days = models.IntegerField(default=7)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    permitted_user = models.ManyToManyField(User(), related_name='user_file', null=True,
                                            blank=True, through='UserFilePermission')

    def __str__(self):
        return self.name + str(self.pk)

    def save(self, *args, **kwargs):
        self.slug = '-'.join((slugify(self.name), slugify(self.user.pk), slugify(self.user.name),
                              slugify(self.size), slugify(self.user.email.split('@')[0])))
        super(File, self).save(*args, **kwargs)


class UserFilePermission(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    subscribed_date = models.DateTimeField(auto_now=True)
    expire_date = models.DateTimeField()

    def __str__(self):
        return self.user.name + str(self.expire_date)

    def save(self, *args, **kwargs):
        self.expire_date = datetime.datetime.now() + datetime.timedelta(days=self.file.expire_days)
        super(UserFilePermission, self).save(*args, **kwargs)
