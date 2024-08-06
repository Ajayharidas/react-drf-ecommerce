# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /django-app

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Install dependencies
COPY requirements.txt /django-app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY wait-for-db.sh /wait-for-db.sh

RUN chmod +x /wait-for-db.sh

# Copy project
COPY . /django-app/
