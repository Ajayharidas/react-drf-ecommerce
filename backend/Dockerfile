# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /django-app

# Install dependencies
COPY requirements.txt /django-app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . /django-app/
