from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model as User
from .models import UserPaymentAccount


class UserDetailsSerializer(serializers.ModelSerializer):
    pub_key = serializers.CharField(source='userpaymentaccount.publishable_key')

    class Meta:
        model = User()
        fields = ['name', 'email', 'is_staff', 'pub_key']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserDetailsSerializer(self.user).data

        for k, v in serializer.items():
            data[k] = v
        # data['username'] = self.user.name
        # data['email'] = self.user.email

        return data


class UserCreateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(required=True, write_only=True)
    pub_key = serializers.CharField(write_only=True, required=False)
    sec_key = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User()
        fields = ['pk', 'name', 'email', 'password', 'password1', 'pub_key', 'sec_key']
        extra_kwargs = {
            'password': {'write_only': True},
            'pk': {'read_only': True},
            'pub_key': {'required': False},
            'sec_key': {'required': False},
        }

    def validate(self, attrs):
        request = self.context.get("request")

        if request.method == "POST":
            if attrs['password1'] != attrs['password']:
                raise serializers.ValidationError({'password': "Password Don't match"})
        else:
            if 'password' in attrs:
                if 'password1' not in attrs:
                    raise serializers.ValidationError({'detail': "Password Don't match"})
                if attrs['password1'] != attrs['password']:
                    raise serializers.ValidationError({'detail': "Password Don't match"})

        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password1', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def create(self, validated_data):
        validated_data.pop('password1')
        pub_key = validated_data.pop('pub_key', None)
        sec_key = validated_data.pop('sec_key', None)
        user = User().objects.create_user(**validated_data)
        UserPaymentAccount.objects.create(user=user, publishable_key=pub_key, secret_key=sec_key)
        return user
