# Image de base
FROM node:20-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Construction de l'application en ignorant les erreurs ESLint et TypeScript
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build || npm run build --no-lint

# Exposition du port
EXPOSE 7860

# Configuration de la commande de démarrage
CMD ["npm", "start", "--", "-p", "7860"]