# Configuración del Agent Builder con Rate Limit

## 📋 Resumen

Tu Agent Builder debe verificar el rate limit **antes** de responder a cada mensaje del usuario.

## 🔧 Pasos de Configuración

### 1. Añadir Endpoint de Rate Limit al Agent Builder

En tu Agent Builder (OpenAI drag & drop), añade un **HTTP Request** al inicio del workflow:

```
Paso 1: HTTP Request
  - URL: https://tu-dominio.com/api/track-message
  - Method: POST
  - Headers:
    - Cookie: (se pasa automáticamente con la sesión)
```

### 2. Añadir Conditional Branch

Después del HTTP Request, añade una **bifurcación condicional**:

```
Paso 2: Conditional Branch
  - IF response.allowed === false:
      → Responder con: response.error
      → DETENER workflow
  - ELSE:
      → Continuar con el flujo normal del agente
```

### 3. Estructura del Workflow

```
[Usuario envía mensaje]
        ↓
[HTTP Request: /api/track-message]
        ↓
[¿allowed === true?]
    ↓           ↓
   Sí          No
    ↓           ↓
[Workflow    [Responder error]
 normal]      [STOP]
```

## 📝 Ejemplo de Configuración

### Nodo HTTP Request

```json
{
  "type": "http_request",
  "config": {
    "url": "{{process.env.NEXT_PUBLIC_APP_URL}}/api/track-message",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "output": "rateLimitCheck"
}
```

### Nodo Conditional

```json
{
  "type": "conditional",
  "condition": "rateLimitCheck.allowed === false",
  "if_true": {
    "type": "response",
    "message": "{{rateLimitCheck.error}}"
  },
  "if_false": {
    "continue": true
  }
}
```

## 🎯 Respuestas del Endpoint

### Cuando está permitido:
```json
{
  "allowed": true,
  "remaining": 2,
  "resetAt": 1730906853155
}
```

### Cuando se alcanzó el límite:
```json
{
  "allowed": false,
  "error": "Has alcanzado el límite de 3 mensajes por día. Podrás enviar más mensajes en aproximadamente 24 horas.",
  "remaining": 0,
  "resetAt": 1730906853155
}
```

## 🔐 Autenticación

El endpoint `/api/track-message` usa **Clerk** para autenticar. Las cookies de sesión se pasan automáticamente desde ChatKit.

## ⚠️ Importante

- El rate limit se cuenta **por mensaje enviado**, no por sesión
- El contador persiste incluso si se borra el historial del chat
- El límite se resetea automáticamente después de 24 horas
- Actualmente configurado en **3 mensajes** (para testing)

## 🧪 Testing

Para probar que funciona:

1. Envía 3 mensajes normales
2. En el mensaje 4, el asistente debe responder:
   > "Has alcanzado el límite de 3 mensajes por día. Podrás enviar más mensajes en aproximadamente 24 horas."

## 📊 Monitorear Rate Limits

```bash
# Ver estado actual
cat .rate-limit/data.json

# Resetear para testing
rm -rf .rate-limit
```
