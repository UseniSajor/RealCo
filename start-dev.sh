#!/bin/bash

# RealCo Development Startup Script
# This script starts the platform in development mode

set -e

echo "🚀 Starting RealCo Platform..."
echo ""

# Check if PostgreSQL is running
check_postgres() {
    if command -v pg_isready &> /dev/null; then
        if pg_isready -q; then
            echo "✅ PostgreSQL is running"
            return 0
        fi
    fi
    echo "⚠️  PostgreSQL not detected. You can:"
    echo "   1. Install PostgreSQL locally"
    echo "   2. Run: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=realco postgres:15"
    echo ""
    return 1
}

# Start backend
start_backend() {
    echo "📦 Setting up backend..."
    cd backend

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "   Installing backend dependencies..."
        npm install
    fi

    # Generate Prisma client
    echo "   Generating Prisma client..."
    npx prisma generate

    # Run migrations if database is available
    if check_postgres; then
        echo "   Running database migrations..."
        npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init

        echo "   Seeding database..."
        npm run seed 2>/dev/null || echo "   (Skipping seed - may already be seeded)"
    fi

    echo "   Starting backend server on port 5001..."
    npm run dev &
    BACKEND_PID=$!
    cd ..

    # Wait for backend to start
    sleep 3
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

# Start frontend
start_frontend() {
    echo ""
    echo "🎨 Setting up frontend..."
    cd apps/web

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "   Installing frontend dependencies..."
        npm install
    fi

    echo "   Starting frontend server on port 3000..."
    npm run dev &
    FRONTEND_PID=$!
    cd ../..

    # Wait for frontend to start
    sleep 5
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
}

# Main
echo "=========================================="
echo "  RealCo Platform - Development Mode"
echo "=========================================="
echo ""

# Start services
start_backend
start_frontend

echo ""
echo "=========================================="
echo "  🎉 RealCo is ready!"
echo "=========================================="
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5001"
echo "  API Docs:  http://localhost:5001/v1/health"
echo ""
echo "  Demo Accounts:"
echo "  - sponsor@realco.com (any password)"
echo "  - investor@realco.com (any password)"
echo "  - provider@realco.com (any password)"
echo ""
echo "  Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt
wait
