# Stage 1: Build-Umgebung mit Python
FROM python:3.11-slim

# Systemabhängigkeiten installieren, inkl. libmagic
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Arbeitsverzeichnis setzen
WORKDIR /app

# Python-Abhängigkeiten installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Den restlichen App-Code kopieren
COPY . .

# Port freigeben
EXPOSE 8000

# App starten
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]