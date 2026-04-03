#!/bin/bash
# HR Team of Agents - Startup Script
# Usage: ./start.sh [agent-name] [port]

AGENT_NAME="${1:-EP Application Agent}"
PORT="${2:-3000}"

echo "🤖 HR Team of Agents - Startup Script"
echo "======================================"
echo ""
echo "Starting: $AGENT_NAME"
echo "Port: $PORT"
echo ""

# Check if agent folder exists
if [ ! -d "$AGENT_NAME" ]; then
    echo "❌ Agent folder not found: $AGENT_NAME"
    echo ""
    echo "Available agents:"
    ls -1
    exit 1
fi

# Navigate to agent folder
cd "$AGENT_NAME" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start server
echo "🚀 Starting server..."
echo ""
PORT=$PORT node server.js
