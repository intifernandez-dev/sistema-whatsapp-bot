# 🤖 Sistema de Automatización de Avisos por WhatsApp

![License](https://img.shields.io/badge/license-Educational%20Only-red)
![Status](https://img.shields.io/badge/status-Portfolio%20Project-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)

> ⚠️ **PROYECTO DE PORTFOLIO - USO EDUCATIVO ÚNICAMENTE**  
> Este código es demostrativo. Para uso comercial, contactar al autor.

Sistema local de automatización para envío de avisos de reparto mediante WhatsApp. Desarrollado para uso comercial con panel de administración web y sistema de licencias.

---

## 📋 Descripción

Aplicación Node.js que automatiza el envío de notificaciones de reparto a clientes mediante WhatsApp. El repartidor autorizado envía un mensaje con el tiempo estimado de llegada, y el sistema automáticamente notifica al cliente correspondiente.

**Características principales:**
- ✅ Bot de WhatsApp con validación de usuarios autorizados
- ✅ Panel web de administración (Express + Bootstrap)
- ✅ Sistema de licencias basado en Machine ID
- ✅ Base de datos de clientes mediante Excel (editable)
- ✅ Mensajes personalizables mediante JSON
- ✅ Control de estados (activar/desactivar sistema)

---

## 🛠️ Tecnologías

- **Backend:** Node.js, Express
- **WhatsApp:** whatsapp-web.js, Puppeteer
- **Base de datos:** Excel (xlsx)
- **Frontend:** HTML, Bootstrap 5
- **Licencias:** node-machine-id

---

## 📁 Estructura del Proyecto

```
sistema-whatsapp-bot/
├── bot.js              # Lógica del bot de WhatsApp
├── server.js           # Servidor web (panel de admin)
├── clientes.js         # Módulo de carga de clientes desde Excel
├── licencia.js         # Sistema de validación de licencias
├── config.json         # Configuración del sistema
├── mensaje_ejemplo.json # Plantilla del mensaje (renombrar a mensaje.json)
├── clientes_ejemplo.csv # Ejemplo de estructura de datos
├── package.json        # Dependencias
├── start.bat           # Script de inicio para Windows
├── LICENSE             # Licencia de uso
└── .gitignore          # Archivos excluidos de Git
```

---

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- npm
- Cuenta de WhatsApp

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/intifernandez-dev/sistema-whatsapp-bot.git
cd sistema-whatsapp-bot
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar mensaje:**

Renombrar `mensaje_ejemplo.json` a `mensaje.json`:

```bash
# Windows
ren mensaje_ejemplo.json mensaje.json

# Linux/Mac
mv mensaje_ejemplo.json mensaje.json
```

Editar `mensaje.json` con tu mensaje personalizado:

```json
{
  "texto": "*Tu Negocio:* 📦 ¡Tu pedido está en camino! Llegará en aproximadamente {{minutos}} minutos."
}
```

> **Importante:** No eliminar `{{minutos}}` - será reemplazado automáticamente.

4. **Crear base de datos de clientes:**

Crear archivo `clientes.xlsx` con esta estructura:

| direccion | telefono |
|-----------|----------|
| calle ejemplo 123 | 5491112345678 |
| avenida ejemplo 456 | 5491187654321 |

**Formato del teléfono:** Código de país + código de área + número  
Ejemplo Argentina: `54` + `911` + `12345678`

Puedes usar el `clientes_ejemplo.csv` como referencia.

5. **Variables de entorno (Opcional - Solo para Producción):**

Si querés activar el sistema de licencias completo:

```bash
# Crear archivo .env
echo "LICENSE_SECRET=tu-secret-super-seguro-aqui" > .env
```

> En modo demo (sin `.env`), el sistema funciona sin restricciones.

---

## 💻 Uso

### Iniciar el Sistema

**Windows:**
```bash
start.bat
```

Este comando abrirá dos ventanas:
1. Servidor web (panel de administración)
2. Bot de WhatsApp

**Linux/Mac:**
```bash
# Terminal 1
node server.js

# Terminal 2 (en otra ventana)
node bot.js
```

### Primer Uso

1. **Abrir panel:** `http://localhost:3000`
2. **Activar licencia** (si está en modo producción):
   - Copiar el Machine ID mostrado
   - Contactar al proveedor para obtener licencia
   - Pegar la licencia en el campo
3. **Conectar WhatsApp:**
   - Se abrirá un navegador con QR
   - Escanear con WhatsApp
4. **Configurar repartidor:**
   - Ingresar número de teléfono autorizado
   - Ejemplo: `5491112345678`
5. **Activar sistema:** Click en "Encender sistema"

### Panel de Administración

**Funciones disponibles:**
- 🟢/🔴 **Estado del sistema:** Activar/Desactivar bot
- 👤 **Repartidor autorizado:** Gestionar quién puede enviar mensajes
- ➕ **Autorizar repartidor:** Agregar nuevo repartidor
- 🗑️ **Eliminar repartidor:** Revocar acceso

### Formato de Mensaje del Repartidor

El repartidor debe enviar mensajes en este formato:

```
20 calle ejemplo 123
```

**Componentes:**
- `20` → Minutos estimados de llegada
- `calle ejemplo 123` → Dirección del cliente (debe coincidir exactamente con Excel)

**El bot automáticamente:**
1. Detecta el mensaje del repartidor autorizado
2. Extrae los minutos y la dirección
3. Busca el teléfono del cliente en la base de datos
4. Envía el mensaje personalizado al cliente
5. Confirma el envío al repartidor

---

## 📂 Configuración Avanzada

### Archivo `config.json`

```json
{
  "activo": false,      // Estado del sistema
  "repartidor": ""      // Número autorizado
}
```

> Este archivo se actualiza automáticamente desde el panel web.

### Archivo `mensaje.json`

Personalizar el mensaje que reciben los clientes:

```json
{
  "texto": "¡Hola! Tu pedido llegará en {{minutos}} minutos. ¡Gracias por tu compra!"
}
```

**Variables disponibles:**
- `{{minutos}}` → Reemplazado por el tiempo estimado

**Formato permitido:**
- Texto plano
- Emojis
- *Texto en negrita* (con asteriscos)
- _Texto en cursiva_ (con guiones bajos)

### Base de Datos de Clientes (`clientes.xlsx`)

**Estructura requerida:**

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| direccion | Dirección del cliente (minúsculas) | calle ejemplo 123 |
| telefono | Número con código de país | 5491112345678 |

**Importante:**
- Las direcciones deben estar en minúsculas
- Los números sin espacios ni guiones
- Formato internacional: `[código país][área][número]`

---

## 🔒 Sistema de Licencias

### Modo Demo (Por Defecto)

**Características:**
- ✅ Sistema completo funcional
- ✅ Sin restricciones de uso
- ✅ Ideal para testing y desarrollo
- ⚠️ Mensaje de advertencia en consola

**Activación:**
- No requiere configuración adicional
- Funciona inmediatamente después de instalar

### Modo Producción (Opcional)

**Características:**
- 🔐 Sistema de licencias activo
- 🔐 Validación por Machine ID
- 🔐 Protección contra uso no autorizado

**Configuración:**

1. Crear archivo `.env`:
```bash
LICENSE_SECRET=tu-secret-personalizado
```

2. Obtener Machine ID:
   - Abrir `http://localhost:3000/activar`
   - Copiar el ID mostrado

3. Generar licencia (contactar al desarrollador)

4. Activar:
   - Pegar licencia en el panel
   - Click en "Activar sistema"

**Formato de licencia:**
```
LIC-{machine-id}-{firma-encriptada}
```

---

## ⚠️ Consideraciones Importantes

### Limitaciones Técnicas

- **WhatsApp Web:** Requiere mantener sesión activa
- **Una cuenta por bot:** No se puede usar el mismo WhatsApp en múltiples lugares
- **Conexión constante:** La PC debe estar encendida y con internet
- **Navegador abierto:** Puppeteer mantiene Chrome/Chromium corriendo

### Seguridad

- ✅ Validación de usuarios autorizados
- ✅ Sistema de licencias (opcional)
- ✅ Base de datos local (no expuesta)
- ⚠️ No cerrar ventanas del sistema mientras está activo

### Mejores Prácticas

1. **Backup de datos:**
   ```bash
   # Respaldar base de datos periódicamente
   cp clientes.xlsx clientes_backup.xlsx
   ```

2. **Monitoreo:**
   - Revisar logs de la consola
   - Verificar confirmaciones de envío

3. **Mantenimiento:**
   - Actualizar Excel cuando cambien clientes
   - Revisar mensajes enviados
   - Mantener sistema actualizado

---

## 🐛 Troubleshooting

### El QR no aparece

**Problema:** Navegador no se abre o no muestra QR

**Soluciones:**
```bash
# 1. Verificar que Puppeteer esté instalado
npm install whatsapp-web.js --save

# 2. Limpiar cache de WhatsApp
rm -rf .wwebjs_auth/
rm -rf .wwebjs_cache/

# 3. Reiniciar el bot
```

### No envía mensajes

**Checklist:**
- [ ] ¿El sistema está activado? (indicador verde)
- [ ] ¿El repartidor está autorizado?
- [ ] ¿La dirección coincide exactamente con el Excel?
- [ ] ¿El número de teléfono está en formato correcto?
- [ ] ¿WhatsApp Web está conectado?

**Debug:**
```javascript
// En bot.js, agregar logs:
console.log("Dirección buscada:", direccion);
console.log("Clientes disponibles:", Object.keys(clientes));
console.log("Número encontrado:", numeroCliente);
```

### Licencia inválida

**Problema:** El sistema no acepta la licencia

**Soluciones:**
1. Verificar que el `LICENSE_SECRET` en `.env` sea correcto
2. Comprobar que el Machine ID no haya cambiado
3. Contactar al proveedor para generar nueva licencia

**Modo alternativo:**
```bash
# Eliminar .env para volver a modo demo
rm .env
```

### Error al leer Excel

**Problema:** `Cannot read file clientes.xlsx`

**Soluciones:**
1. Verificar que el archivo existe en la raíz del proyecto
2. Comprobar que el nombre sea exacto: `clientes.xlsx`
3. Validar estructura de columnas: `direccion`, `telefono`

---

## 📖 Casos de Uso

### Ejemplo Real: Pizzería

**Configuración:**
```json
// mensaje.json
{
  "texto": "🍕 *Pizzería Mario:* Tu pedido está en camino! Llegará en {{minutos}} minutos. ¡Que lo disfrutes!"
}
```

**Base de datos (clientes.xlsx):**
| direccion | telefono |
|-----------|----------|
| san martin 1234 | 5491134567890 |
| rivadavia 567 | 5491145678901 |

**Flujo:**
1. Repartidor sale a entregar → Envía "15 san martin 1234"
2. Bot procesa → Envía a 5491134567890
3. Cliente recibe → "🍕 Pizzería Mario: Tu pedido está en camino! Llegará en 15 minutos..."

### Ejemplo: Farmacia con Entregas

**Configuración:**
```json
{
  "texto": "💊 *Farmacia Central:* Tu pedido está en camino. Tiempo estimado: {{minutos}} minutos. Gracias por confiar en nosotros!"
}
```

**Ventajas:**
- Reduce llamadas telefónicas
- Mejora experiencia del cliente
- Automatiza comunicación
- Genera confianza

---

## 🔧 Desarrollo

### Arquitectura del Sistema

```
┌─────────────────┐
│  Repartidor     │ ──► Envía mensaje con tiempo + dirección
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bot WhatsApp   │ ──► Valida autorización
│  (bot.js)       │ ──► Parsea mensaje
└────────┬────────┘ ──► Busca en base de datos
         │
         ▼
┌─────────────────┐
│  Base de Datos  │ ──► Retorna número de cliente
│  (clientes.xlsx)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cliente Final  │ ◄── Recibe notificación automática
└─────────────────┘
```

### Extender Funcionalidades

**Agregar nuevas variables al mensaje:**

```javascript
// bot.js
let mensaje = mensajeConfig.texto
  .replace("{{minutos}}", minutos)
  .replace("{{direccion}}", direccion)  // Nueva variable
  .replace("{{repartidor}}", nombreRepartidor);  // Nueva variable
```

```json
// mensaje.json
{
  "texto": "Hola! Tu pedido de {{direccion}} llegará en {{minutos}} min. Repartidor: {{repartidor}}"
}
```

**Agregar validaciones:**

```javascript
// bot.js - Agregar después de extraer minutos
if (minutos < 5 || minutos > 120) {
  message.reply("⚠️ Tiempo inválido. Usar entre 5 y 120 minutos.");
  return;
}
```

**Integrar con otras APIs:**

```javascript
// Ejemplo: Enviar a sistema de tracking
const axios = require('axios');

await axios.post('https://tu-api.com/tracking', {
  cliente: direccion,
  eta: minutos,
  timestamp: new Date()
});
```

---

## 📊 Métricas y Analytics (Ideas de Expansión)

```javascript
// Agregar sistema de métricas
const metrics = {
  mensajesEnviados: 0,
  tiempoPromedio: 0,
  clientesMasAtendidos: {}
};

// Guardar métricas en JSON
fs.writeFileSync('./metrics.json', JSON.stringify(metrics));
```

---

## 🤝 Contribuciones

Este es un proyecto de portfolio personal y **no acepta contribuciones externas** en este momento.

Sin embargo, si encontrás un bug o tenés una sugerencia:
- 📧 Email: intifernandez.dev@gmail.com
- 💼 LinkedIn: [intifernandez-dev](https://linkedin.com/in/intifernandez-dev)

---

## 📜 Licencia

Este proyecto está bajo una **Licencia de Uso Educativo y Demostrativo**.

**Permisos:**
- ✅ Ver y estudiar el código
- ✅ Usar como referencia educativa
- ✅ Analizar la arquitectura

**Restricciones:**
- ❌ Uso comercial sin autorización
- ❌ Redistribución del código
- ❌ Copia para proyectos propios

Ver [LICENSE](LICENSE) para más detalles.

**Para uso comercial:** Contactar a intifernandez.dev@gmail.com

---

## 👨‍💻 Autor

**Inti Fernández**


- 🌐 **Portfolio:** [intifernandez-dev.netlify.app](https://intifernandez-dev.netlify.app)
- 💼 **LinkedIn:** [intifernandez-dev](https://linkedin.com/in/intifernandez-dev)
- 📧 **Email:** intifernandez.dev@gmail.com
- 🐙 **GitHub:** [@intifernandez-dev](https://github.com/intifernandez-dev)

---


⭐ Si este proyecto te pareció útil, considerá darle una estrella en GitHub

