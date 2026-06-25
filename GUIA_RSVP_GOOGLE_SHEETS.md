# Guía: guardar las respuestas del RSVP en Google Sheets

Esta guía conecta el formulario RSVP de la invitación con una hoja privada de Google Sheets mediante una aplicación web de Google Apps Script.

El flujo final será:

```text
Formulario RSVP → Google Apps Script → Google Sheets
```

## Datos que se guardarán

Cada respuesta generará una fila con estas columnas:

| Columna | Contenido |
| --- | --- |
| `ID` | Identificador único generado por Google Apps Script |
| `Fecha de recepción` | Fecha y hora del servidor |
| `Nombre completo` | Nombre del invitado |
| `Asistirá` | `si` o `no` |
| `Restricciones alimentarias` | Texto opcional |
| `Información de viaje` | `si` o `no` |
| `Mensaje para los novios` | Texto opcional, máximo 500 caracteres |

## 1. Crear la hoja de cálculo

1. Crea una hoja nueva en [Google Sheets](https://sheets.google.com).
2. Cambia el nombre de la pestaña inferior a `RSVP`.
3. En la primera fila agrega exactamente estos encabezados, uno por columna:

```text
ID | Fecha de recepción | Nombre completo | Asistirá | Restricciones alimentarias | Información de viaje | Mensaje para los novios
```

4. Copia el ID de la hoja desde su URL. Es el texto ubicado entre `/d/` y `/edit`:

```text
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

La hoja no necesita ser pública. Google Apps Script escribirá en ella usando los permisos de su propietario.

## 2. Crear el servicio de Google Apps Script

En la hoja, abre **Extensiones → Apps Script**. Borra el contenido inicial y pega este código:

```javascript
const SPREADSHEET_ID = "REEMPLAZAR_CON_EL_ID_DE_LA_HOJA";
const SHEET_NAME = "RSVP";

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("La solicitud no contiene datos.");
    }

    const data = JSON.parse(e.postData.contents);
    const rsvp = validateRsvp(data);
    const id = Utilities.getUuid();
    const receivedAt = new Date().toISOString();

    lock.waitLock(10000);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`No existe la pestaña ${SHEET_NAME}.`);
    }

    sheet.appendRow([
      id,
      receivedAt,
      safeCell(rsvp.fullName),
      rsvp.attending,
      safeCell(rsvp.dietaryRestrictions),
      rsvp.travelSupport,
      safeCell(rsvp.messageToCouple),
    ]);

    return jsonResponse({
      ok: true,
      id,
      receivedAt,
    });
  } catch (error) {
    console.error(error);

    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function validateRsvp(data) {
  const fullName = cleanText(data.fullName, 120);
  const dietaryRestrictions = cleanText(data.dietaryRestrictions, 280);
  const messageToCouple = cleanText(data.messageToCouple, 500);

  if (fullName.length < 3) {
    throw new Error("El nombre completo no es válido.");
  }

  if (!["si", "no"].includes(data.attending)) {
    throw new Error("La respuesta de asistencia no es válida.");
  }

  if (!["si", "no"].includes(data.travelSupport)) {
    throw new Error("La respuesta de viaje no es válida.");
  }

  return {
    fullName,
    attending: data.attending,
    dietaryRestrictions,
    travelSupport: data.travelSupport,
    messageToCouple,
  };
}

function cleanText(value, maxLength) {
  const text = String(value ?? "").trim();

  if (text.length > maxLength) {
    throw new Error(`Uno de los textos supera ${maxLength} caracteres.`);
  }

  return text;
}

// Evita que un texto escrito por un invitado se interprete como una fórmula.
function safeCell(value) {
  return String(value).replace(/^[=+\-@]/, "'$&");
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Reemplaza `REEMPLAZAR_CON_EL_ID_DE_LA_HOJA` con el ID copiado en el paso anterior y guarda el proyecto.

El bloqueo de `LockService` evita que dos envíos simultáneos intenten modificar la hoja al mismo tiempo. La función `safeCell` evita que los mensajes de los invitados puedan convertirse accidentalmente en fórmulas de Google Sheets.

## 3. Desplegar Apps Script como aplicación web

1. Presiona **Implementar → Nueva implementación**.
2. En **Seleccionar tipo**, elige **Aplicación web**.
3. En **Ejecutar como**, selecciona **Yo**.
4. En **Quién tiene acceso**, selecciona **Cualquier persona**.
5. Presiona **Implementar** y autoriza el acceso solicitado.
6. Copia la URL publicada. Debe terminar en `/exec`.

No uses la URL terminada en `/dev`: solo funciona para usuarios con acceso al proyecto de Apps Script.

Cuando modifiques el script posteriormente, abre **Implementar → Administrar implementaciones**, edita la implementación y crea una versión nueva.

Documentación oficial: [Aplicaciones web de Google Apps Script](https://developers.google.com/apps-script/guides/web).

## 4. Conexión implementada en el proyecto React

El formulario ya llama al transporte real de Google Apps Script desde `src/lib/submitRSVP.ts`. La implementación:

- Lee `VITE_RSVP_ENDPOINT`.
- Comprueba que sea una URL HTTPS de Google Apps Script terminada en `/exec`.
- Envía los datos como JSON usando `text/plain` para evitar una solicitud previa innecesaria.
- Sigue la redirección de Google Content Service.
- Cancela la solicitud si tarda más de 15 segundos.
- Solo muestra el estado exitoso cuando Apps Script devuelve `ok`, `id` y `receivedAt`.

El transporte implementado es equivalente a:

```typescript
export interface RSVPInput {
  fullName: string;
  attending: "si" | "no";
  dietaryRestrictions: string;
  travelSupport: "si" | "no";
  messageToCouple: string;
}

export interface RSVPResult {
  id: string;
  receivedAt: string;
}

const endpoint = import.meta.env.VITE_RSVP_ENDPOINT;

export async function submitRSVP(data: RSVPInput): Promise<RSVPResult> {
  if (!endpoint) {
    throw new Error("Falta configurar VITE_RSVP_ENDPOINT.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script respondió con ${response.status}.`);
  }

  const result = (await response.json()) as GoogleSheetsResponse;

  if (!result.ok || !result.id || !result.receivedAt) {
    throw new Error(result.error ?? "No fue posible guardar la confirmación.");
  }

  return {
    id: result.id,
    receivedAt: result.receivedAt,
  };
}
```

El código real también incluye validación de URL, timeout y mensajes de error específicos.

## 5. Configurar la URL localmente

El archivo `.env.local` ya existe en la raíz del proyecto. Completa su valor:

```dotenv
VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/IDENTIFICADOR_DE_IMPLEMENTACION/exec
```

Reinicia `npm run dev` después de modificar el archivo.

Las variables `VITE_*` quedan incluidas en el JavaScript del navegador. Esto es correcto para la URL pública del endpoint, pero nunca se deben colocar contraseñas, tokens privados o credenciales en ellas.

## 6. Configurar la URL en GitHub Pages

El sitio se construye mediante `.github/workflows/deploy.yml`, por lo que `.env.local` no estará disponible durante el despliegue.

1. En el repositorio de GitHub, abre **Settings → Secrets and variables → Actions → Variables**.
2. Crea una variable llamada `VITE_RSVP_ENDPOINT` con la URL `/exec`.
3. El workflow `.github/workflows/deploy.yml` ya pasa esta variable al paso de compilación:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_RSVP_ENDPOINT: ${{ vars.VITE_RSVP_ENDPOINT }}
```

No es necesario guardar esta URL como secreto: una aplicación Vite siempre la expondrá en el navegador.

## 7. Probar la integración

Realiza al menos estas pruebas:

1. Envía una confirmación de asistencia normal.
2. Comprueba que aparezca una sola fila y que todas las columnas estén en el orden correcto.
3. Envía una respuesta indicando que no asistirá.
4. Prueba restricciones alimentarias y un mensaje para los novios.
5. Escribe un valor que empiece por `=` en un campo de texto y confirma que la hoja lo guarde como texto, no como fórmula.
6. Prueba desde la URL real de GitHub Pages, no solamente desde el servidor local.
7. Comprueba que el formulario muestre un error si Apps Script no está disponible.

## Consideraciones importantes

### Respuestas y CORS

Google Content Service redirige sus respuestas a una URL temporal de `script.googleusercontent.com`. Los navegadores modernos normalmente siguen la redirección, pero la prueba definitiva debe hacerse desde el dominio publicado en GitHub Pages.

No agregues `mode: "no-cors"` para ocultar un error de CORS. Eso produciría una respuesta opaca: el formulario no podría comprobar si la fila fue guardada y podría mostrar una confirmación falsa. Si el navegador bloquea la respuesta, la solución correcta es usar una función serverless o un proxy pequeño delante de Apps Script.

Documentación oficial: [Content Service y sus redirecciones](https://developers.google.com/apps-script/guides/content).

### Privacidad y abuso

- Mantén privada la hoja de cálculo.
- No solicites información sensible que no sea necesaria para organizar el evento.
- El endpoint debe aceptar acceso público para que los invitados no tengan que iniciar sesión. Por eso puede recibir spam si alguien descubre la URL.
- Si el sitio recibe tráfico no deseado, agrega una verificación anti-bot en un backend o función serverless. Una clave incluida directamente en Vite no protege el endpoint porque cualquier visitante puede verla.

## Referencias oficiales

- [Aplicaciones web de Google Apps Script](https://developers.google.com/apps-script/guides/web)
- [Content Service](https://developers.google.com/apps-script/guides/content)
- [Lock Service](https://developers.google.com/apps-script/reference/lock)
- [Servicio Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet)
