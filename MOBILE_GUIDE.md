# Safachatt PG PWA Guide

## What changed
- Added a mobile-first responsive shell to the existing website.
- Added a PWA manifest and service worker for offline support and installability.
- Added a bottom navigation bar, install prompt, share, location and notification helpers.

## Run locally
1. Open the project in a simple local server.
2. For example: `python -m http.server 8000`
3. Visit `http://localhost:8000`

## Install as a PWA
- On supported mobile browsers, use the install prompt or browser menu to add the site to the home screen.
- The app will behave like a mobile app with offline caching and a standalone display.

## Notes
- This project is intentionally PWA-only. There are no Android or iOS native project folders in the repository.
