# Use Python Alpine as base image for smaller size
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Install system dependencies needed for Python packages
# gcc, musl-dev for compiling Python packages
# linux-headers for some packages that need system headers
RUN apk add --no-cache \
    gcc \
    musl-dev \
    linux-headers \
    g++ \
    libffi-dev \
    openssl-dev \
    cargo \
    rust

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN adduser -D -s /bin/sh appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 9090

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:9090/health/courses-cache')" || exit 1

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]
