import datetime
import random,string

from django.db import models
from django.contrib.auth import get_user_model as User
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.text import slugify


def get_upload_path(instance, filename):
    return f"{instance.user.pk}/{filename}"


def id_generator(size=6, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))


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
    file_password = models.CharField(max_length=10, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    permitted_user = models.ManyToManyField(User(), related_name='user_file', null=True,
                                            blank=True, through='UserFilePermission')

    class Meta:
        unique_together = ['user', 'name']

    def __str__(self):
        return self.name + " " + str(self.pk)

    def save(self, *args, **kwargs):
        if not self.file_password:
            self.file_password = id_generator()
        if not self.slug:
            self.slug = '-'.join((slugify(self.name), slugify(self.user.pk), slugify(self.user.name),
                                  slugify(self.size), slugify(self.user.email.split('@')[0]), id_generator()))
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


@receiver(post_delete, sender=File)
def post_save_image(sender, instance, *args, **kwargs):
    """ Clean Old Image file """
    try:
        instance.content.delete(save=False)
    except:
        pass