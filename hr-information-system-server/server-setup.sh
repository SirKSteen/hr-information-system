#!/bin/bash

echo "Restoring .NET packages..."
dotnet restore

echo "Restoring dotnet tools..."
dotnet tool restore

if [ ! -f .env ]; then
  echo "Creating .env from .env.template..."
  cp .env.template .env
else
  echo ".env already exists. Skipping copy."
fi

echo "Running EF Core migrations..."
dotnet ef database update

echo "Start the server..."
dotnet run