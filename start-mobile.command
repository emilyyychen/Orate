#!/bin/bash
cd "$(dirname "$0")"
echo "========================================="
echo "  Starting Expo for mobile..."
echo "  Scan QR code with Expo Go app"
echo "========================================="
npx expo start --tunnel 2>/dev/null || npx expo start
