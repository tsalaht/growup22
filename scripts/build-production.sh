#!/bin/bash

# Production Build Script for APK with Real Ads
echo "🚀 Building Production APK with Real Ads..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Installing..."
    npm install -g @expo/eas-cli
fi

# Login to EAS (if not already logged in)
echo "🔐 Checking EAS authentication..."
eas whoami || eas login

# Clean previous builds
echo "🧹 Cleaning previous builds..."
eas build:cancel --all --non-interactive 2>/dev/null || true

# Build production APK
echo "📱 Building production APK..."
eas build --platform android --profile production --non-interactive

echo "✅ Production APK build completed!"
echo "📥 Download the APK from the EAS dashboard or use the provided link"
echo "🎯 The APK will show REAL ADS (not test ads)"


