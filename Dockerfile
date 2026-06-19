FROM nginx:alpine

# Supprimer la configuration par défaut de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers du site statique
COPY public/ /usr/share/nginx/html/

# Définir les permissions correctes
RUN chmod -R 755 /usr/share/nginx/html/

# Exposer le port 80 pour que Dokku détecte automatiquement le port
EXPOSE 80

# Lancer nginx en premier plan (empêche le container de s'arrêter immédiatement)
CMD ["nginx", "-g", "daemon off;"]
