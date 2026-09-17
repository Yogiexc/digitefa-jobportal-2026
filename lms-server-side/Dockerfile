FROM php:8.2-fpm-bullseye

# Configure apt to ignore GPG verification errors and remove docker-clean to bypass post-invoke failures (seccomp bypass)
RUN rm -f /etc/apt/apt.conf.d/docker-clean && \
    echo 'Acquire::AllowInsecureRepositories "true";' > /etc/apt/apt.conf.d/99insecure && \
    echo 'Acquire::AllowUnsecureRepositories "true";' >> /etc/apt/apt.conf.d/99insecure && \
    echo 'APT::Get::AllowUnauthenticated "true";' >> /etc/apt/apt.conf.d/99insecure

# Download the latest mlocati extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PHP Extensions using the installer (downloads precompiled binaries when possible)
RUN install-php-extensions \
    pcntl \
    zip \
    bcmath \
    pdo_mysql \
    mysqli

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy all files
COPY . .

# Install dependencies
RUN composer install --ignore-platform-reqs --no-dev -a

# Set permission Laravel storage & cache
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Configure PHP upload limit
RUN echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/custom.ini

EXPOSE 9000
CMD ["php-fpm"]