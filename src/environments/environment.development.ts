/**
 * Local development (ng serve). Points to the Spring Boot backend started locally
 * (NodeSecure.Platform.BackEnd, server.port=8080). Do not point it to the Express mock in /server
 * (ports 3000/8000 or node-secure-api.onrender.com): it has no GET /authentication/me nor the
 * subscription and profile endpoints, so sessions cannot be restored there.
 */
export const environment = {
  production: false,
  serverBaseUrl: 'http://localhost:8080/api/v1',
  landingPageUrl: 'https://securezoneteam.github.io/NodeSecure-Landing-Page/',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'],
  requireCredentials: true,
};
