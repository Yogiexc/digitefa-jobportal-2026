# Use Python slim as base image
FROM python:3.8-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=1000 --retries 20 --progress-bar off --upgrade pip && \
    pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple -f https://mirrors.aliyun.com/pytorch-wheels/cpu/ --default-timeout=1000 --retries 20 --progress-bar off -r requirements.txt

RUN pip uninstall -y hf_xet || true

# Copy application code
COPY . .

# Create non-root user for security
# Pre-download the model files individually to completely bypass threading issues
ENV HF_HOME=/home/appuser/.cache/huggingface
ENV HF_HUB_DISABLE_PROGRESS_BARS=1
RUN python download_model.py

RUN useradd -m -s /bin/sh appuser || true
RUN chown -R appuser:appuser /app /home/appuser

USER appuser

# Expose port
EXPOSE 9090

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090", "--loop", "asyncio"]
