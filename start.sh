#!/bin/bash

# ========================================
# TWT Transport Booking System - Start Script
# ========================================

echo "🚀 Starting TWT Transport Booking System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    lsof -ti :$1 | xargs kill -9 2>/dev/null
}

# Kill any existing processes on ports 3000 and 5001
echo -e "${YELLOW}🔍 Checking for existing processes...${NC}"
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Attempting to free it...${NC}"
    kill_port 3000
    sleep 2
fi

if check_port 5001; then
    echo -e "${YELLOW}⚠️  Port 5001 is in use. Attempting to free it...${NC}"
    kill_port 5001
    sleep 2
fi

# Change to project root directory
cd "$(dirname "$0")"

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ .env file created successfully${NC}"
    echo -e "${BLUE}📝 Database configuration should be ready for TWT_Transport_System${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install --silent

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ..
npm install --silent

# Start backend server in the background
echo -e "${GREEN}🚀 Starting backend server on port 5001...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start and check if it's running
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
for i in {1..10}; do
    sleep 1
    if check_port 5001; then
        echo -e "${GREEN}✅ Backend server started successfully!${NC}"
        break
    fi
    echo -n "."
done

# Verify backend is responding
echo -e "${BLUE}🔍 Testing backend API...${NC}"
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding!${NC}"
else
    echo -e "${RED}❌ Backend API is not responding. Please check the logs.${NC}"
fi

# Start frontend server
echo -e "${GREEN}🚀 Starting frontend server on port 3000...${NC}"
cd ..

echo -e "${BLUE}🌐 Opening browser automatically...${NC}"
echo -e "${GREEN}✅ Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}✅ Backend API: http://localhost:5001/api${NC}"
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"
echo ""

npm start

# Handle script termination
trap "echo 'Stopping servers...'; kill $BACKEND_PID 2>/dev/null" EXIT

# Keep script running
wait 