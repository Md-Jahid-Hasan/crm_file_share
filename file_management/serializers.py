import os.path
from django.db import IntegrityError
from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = ['content', 'created_at', 'id', 'name', 'size', 'slug', 'is_public', 'price', 'other_link', 'is_paid']
        read_only_fields = ('user', 'slug',)

    def create(self, validated_data):
        req = self.context['request']
        if req.user.disk_space + validated_data['size'] < req.user.maximum_capacity:
            req.user.disk_space = req.user.disk_space + validated_data['size']
            req.user.save()
        else:
            raise serializers.ValidationError({"Size": "You have not enough space"})
        validated_data['user'] = req.user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"name": "Please provide a unique name"})
