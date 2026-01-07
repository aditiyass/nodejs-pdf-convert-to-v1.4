FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install minimal dependencies + Ghostscript
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS (20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g npm \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (best practice & security)
RUN useradd -m appuser
USER appuser

WORKDIR /app

COPY --chown=appuser:appuser . .

RUN if [ -f package.json ]; then npm install; fi

EXPOSE 3000

CMD ["node", "app.js"]
