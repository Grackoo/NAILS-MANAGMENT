# L'Atelier Vernis | Haute Beauté & Studio

Plataforma de alta estética y salón boutique de manicura de autor, agendamiento de citas y consola administrativa. Proyecto exportado de Google AI Studio y configurado para ejecución local completa.

---

## 🚀 Cómo ver el proyecto en local

El servidor de desarrollo ya se encuentra configurado y funcionando.

### Opción 1: Un solo clic (Windows)
Haz doble clic en el archivo:
- **`iniciar.bat`** (ubicado en la raíz del proyecto). Abrirá el navegador automáticamente en `http://localhost:3000`.

### Opción 2: Desde la terminal
1. Asegúrate de tener las dependencias instaladas:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre tu navegador en:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📱 Vistas y Funcionalidades Incluidas

1. **Modo Clienta (Boutique Frontend)**:
   - **Catálogo de Servicios**: Selección por categoría (Gel, Acrílicas, Spa, Diseños de Autor) con duración y precio.
   - **Flujo de Agendamiento Inteligente**: Selección de técnica/manicurista, fecha y bloque de horario disponible.
   - **Galería de Trabajos**: Portafolio visual de diseños.
   - **Mis Citas**: Visualización de citas confirmadas, estados y detalle de servicios.
   - **Programa de Lealtad**: Acumulación de puntos, niveles VIP y recompensas.
   - **Configuración de Notificaciones**: Alertas SMS / WhatsApp / Recordatorios automáticos.
   - **Simulador Vista Móvil**: Puedes alternar entre vista de escritorio y marco móvil interactivo (iPhone).

2. **Modo Administración (Consola de Gestión)**:
   - **Agenda / Calendario**: Vista de citas programadas, técnicos asignados y estados de atención.
   - **Lista de Espera Inteligente**: Detección y notificación automática de cancelaciones y cupos liberados.
   - **Moderación de Reseñas**: Aprobación y gestión de testimonios de clientas.
   - **Catálogo y Tarifas**: Edición de servicios, precios y tiempos de sesión.
   - **Gestión de Clientas (CRM)**: Historial de visitas, notas técnicas y fórmulas personalizadas.
   - **Configuración de Horarios**: Bloques de apertura, descansos y disponibilidad de profesionales.
   - **Métricas y Reportes**: Gráficos interactivos de ingresos, volumen de citas y servicios más solicitados.

---

## 🛠️ Ajustes realizados para el entorno local
- **Resolución de Dependencias**: Se resolvió el conflicto entre `vite@8` y `esbuild`, y se agregó `react-is` requerido por Recharts en React 19.
- **Configuración npm (.npmrc)**: Añadido `legacy-peer-deps=true` para garantizar instalaciones estables.
- **Rutas ESM en Vite**: Compatibilidad con `fileURLToPath` en `vite.config.ts`.
- **Variables de Entorno**: Archivo [.env.local](.env.local) generado con defaults locales.
- **Lanzador Rápido**: Creado `iniciar.bat` para iniciar con un solo clic en Windows.
