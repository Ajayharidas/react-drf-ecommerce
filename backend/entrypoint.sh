#!/bin/bash

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Make migrations"
python manage.py makemigrations

echo "Apply database migrations"
python manage.py migrate

echo "Starting gunicorn"
gunicorn --timeout 300 ecommerce.wsgi:application --bind 0.0.0.0:8000
