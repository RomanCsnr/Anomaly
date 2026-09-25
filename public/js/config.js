// URL de l'API : locale en développement, Vercel en production
const API_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3000'
    : 'https://anomaly-api-ecru.vercel.app';
