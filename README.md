# TripMate

Gemeinsame Urlaubsplanung als Progressive Web App (PWA).

**Live:** https://theminhnguyen.github.io/tripmate/

## Features
- Listen nach Kategorien: Sehenswürdigkeit, Restaurant, Shopping, Sonstiges
- Auto-Fill von Adresse, Koordinaten und (wenn verfügbar) Öffnungszeiten + Website via OpenStreetMap
- Kalender-Ansicht mit Tagen + Uhrzeiten
- Karten-Ansicht (Leaflet + OpenStreetMap)
- Share-Link zum gemeinsamen Planen
- Installierbar auf Home-Screen (iOS + Android)
- Funktioniert offline nach erstem Laden

## Stack
- Vanilla HTML/CSS/JS — keine Build-Tools
- Leaflet für die Karte
- Nominatim + Overpass API für Geocoding und POI-Details
- LZ-String für kompakte Share-URLs
- LocalStorage für Persistenz
- Service Worker für Offline-Modus

## Datenschutz
Alle Daten werden lokal im Browser gespeichert. Externe Requests gehen nur an OpenStreetMap-APIs (Nominatim, Overpass, Tiles) — das ist zum Anzeigen der Karte und zum Suchen von Orten nötig. Beim Teilen sind die Daten direkt in der URL kodiert, kein Server involviert.

## Siehe auch
[ANLEITUNG.md](./ANLEITUNG.md) — Schritt-für-Schritt-Anleitung zur Nutzung.
