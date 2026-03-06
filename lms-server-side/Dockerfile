FROM dunglas/frankenphp:latest

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install PHP Extensions
RUN install-php-extensions \
    pcntl \
    zip \
    bcmath \
    pdo_mysql \
    mysqli

# Install Composer secara manual
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies lebih awal untuk caching
RUN composer install --ignore-platform-reqs --no-dev -a

# Copy semua file aplikasi setelah dependencies terinstall

# Set Environment Production
ENV APP_ENV=production
ENV APP_DEBUG=false

# Install Octane dengan FrankenPHP tanpa interaksi
RUN echo "yes" | php artisan octane:install --server=frankenphp --no-interaction

# Set permission Laravel storage & cache dengan user www-data
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 777 storage bootstrap/cache

# Konfigurasi PHP upload limit
RUN echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/custom.ini

# Expose port 8010
EXPOSE 8010

# Jalankan Laravel Octane dengan FrankenPHP
CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=8010"]