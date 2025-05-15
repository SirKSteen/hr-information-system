#!/bin/bash

if [ ! -f .env ]; then
  echo "Creating .env from .env.template..."
  cp .env.template .env
else
  echo ".env already exists. Skipping copy."
fi

echo "Install dependencies..."
npm install

echo "Start the development server..."
npm run start