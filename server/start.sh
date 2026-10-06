#!/bin/sh
# Launcher for the NodeSecure fake REST API backend (json-server).
# Base URL: http://localhost:3000/api/v1
npx json-server --watch server/db.json --routes server/routes.json --port 3000
