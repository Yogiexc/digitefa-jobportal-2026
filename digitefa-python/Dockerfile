<<<<<<< HEAD
# Use Python slim as base image
FROM python:3.12-slim
=======
# Use Python Alpine as base image for smaller size
FROM python:3.12-alpine
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204

# Set working directory
WORKDIR /app

# Install system dependencies needed for Python packages
<<<<<<< HEAD
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
=======
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
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
<<<<<<< HEAD
RUN useradd -m -s /bin/sh appuser && \
=======
RUN adduser -D -s /bin/sh appuser && \
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 9090

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:9090/health/courses-cache')" || exit 1

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]
