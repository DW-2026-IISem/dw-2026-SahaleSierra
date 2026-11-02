/**
 * Entorno de producción (`ng build`).
 *
 * `apiUrl` termina en `/api` SIN slash final: con uno, las llamadas saldrían
 * como `//patients` y Express las trataría como otra ruta.
 *
 * `requireAuth`: mitad frontal del interruptor de fases. Nadie lo lee hasta
 * ISS-15 (Fase II). Se empareja con `AUTH_ENABLED` del backend: mover una sola
 * mitad produce `401 Missing Bearer token`.
 *
 * `primeUiLicense`: clave **Community** de PrimeUI (PrimeNG 22). Solicítala en
 * https://primeui.dev · requisitos en https://primeui.dev/licenses. Déjala en `''`
 * si aún no la tienes (aviso en consola; la app funciona). No subas claves
 * comerciales al repo.
 */
export const environment = {
  production: true,
  appName: 'SaludConecta',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: 'eyJpZCI6ImUyY2IyMWQ4LTIwY2YtNDg2NS1iM2ZjLWEzNTA5M2VhYmJmMyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTM1ODkxNjcsImV4cCI6MTgyNTEyNTE2N30.0txrdq8E056BY3Zf4OXNFTIlhjRfG0KykBsSEd3Q6ULoxoDZlsBNLrVdhH20qEJqyA7vaib2yDW-MLvISPXVDQ',
};
