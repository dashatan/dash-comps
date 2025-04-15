#!/bin/bash

# Script to install missing UI component dependencies
echo "Installing missing UI component dependencies..."

# Install Radix UI components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-badge

# Install other required dependencies
npm install class-variance-authority clsx tailwind-merge

echo "Dependencies installed successfully!"
echo "Now you can use the UI components without errors." 