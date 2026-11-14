import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // Le jeton JWT voyage dans un cookie httpOnly envoyé automatiquement par le navigateur
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cgs_token'); // purge d'un éventuel ancien jeton stocké avant la migration
      localStorage.removeItem('cgs_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  // Protection stricte anti-XSS (Recommandation CodeQL) : interdire javascript:, vbscript: et data non-image
  if (/^(javascript|vbscript):/i.test(trimmed)) {
    return '';
  }
  if (trimmed.startsWith('data:') && !trimmed.startsWith('data:image/')) {
    return '';
  }
  return trimmed;
};

export const getPhotoUrl = (path) => {
  const cleanPath = sanitizeImageUrl(path);
  if (!cleanPath) return null;

  // Si c'est déjà une URL complète (http/https/data/blob)
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://') || cleanPath.startsWith('data:') || cleanPath.startsWith('blob:')) {
    // Convertir les liens Google Drive en liens image directs
    // Format: https://drive.google.com/file/d/FILE_ID/view?...
    const driveMatch = cleanPath.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    // Format: https://drive.google.com/open?id=FILE_ID
    const driveMatch2 = cleanPath.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveMatch2) {
      return `https://lh3.googleusercontent.com/d/${driveMatch2[1]}`;
    }
    // Format: https://drive.google.com/uc?id=FILE_ID
    const driveMatch3 = cleanPath.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (driveMatch3) {
      return `https://lh3.googleusercontent.com/d/${driveMatch3[1]}`;
    }
    return cleanPath;
  }

  // Nettoyer tous les préfixes "uploads/", "/uploads/", "\uploads\", etc. (sans doubler le préfixe)
  let clean = String(cleanPath).trim().replace(/^[/\\]+/, '');
  while (/^uploads[/\\]+/i.test(clean)) {
    clean = clean.replace(/^uploads[/\\]+/i, '').replace(/^[/\\]+/, '');
  }

  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://127.0.0.1:5000');
  return `${baseUrl}/uploads/${clean}`;
};

export default api;
