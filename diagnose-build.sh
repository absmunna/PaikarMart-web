#!/bin/bash
echo "--- Build Diagnostics ---"
echo "Current Directory: $(pwd)"
echo "Node Version: $(node -v)"
echo "npm Version: $(npm -v)"
if command -v pnpm &> /dev/null; then
    echo "pnpm Version: $(pnpm -v)"
else
    echo "pnpm: command not found"
fi
echo "PATH: $PATH"
echo "-------------------------"
