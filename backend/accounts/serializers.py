from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'height', 'weight', 'birthday', 'gender']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # Define custom create and update for password hashing
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data) # Create User instance
        if password:
            user.set_password(password) # Set and hash the password using Django's hashing algorithm
        user.save() 
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance