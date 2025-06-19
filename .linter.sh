#!/bin/bash
cd /home/kavia/workspace/code-generation/serenethoughts-63075-4d95f666/serenethoughts_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

