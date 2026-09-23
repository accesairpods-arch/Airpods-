# AirPods Quito — versión profesional

## Qué incluye
- Tienda pública.
- Panel `/admin`.
- Login con sesión de servidor.
- Productos guardados en `data/store.json`.
- Subida de imágenes a `public/uploads`.
- Cambio de WhatsApp desde el panel.
- API para productos y configuración.
- Diseño responsive.

## Instalar
Requiere Node.js 20+.

```bash
npm install
cp .env.example .env
npm start
```

Después abre `/` y `/admin`.

## Producción
Configura variables de entorno reales y usa HTTPS. Haz copias de `data/store.json` y `public/uploads`.
Para una tienda con muchos pedidos, pagos online y múltiples administradores, sustituye el JSON por PostgreSQL/Supabase y agrega un proveedor de pagos.


Credenciales iniciales del panel:
- Usuario: admin
- Contraseña: airpodsquito

WhatsApp configurado: 0987302507 (internacional: 593987302507)
