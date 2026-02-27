# TodoList App

Aplicación web de lista de tareas full-stack con API REST en el backend y JavaScript vanilla en el frontend.

> UI inspirada en [todo.uiineed.com](https://todo.uiineed.com/)

---

## Stack Tecnológico

| Capa        | Tecnología                        |
|-------------|-----------------------------------|
| Frontend    | HTML, CSS, JavaScript Vanilla     |
| Backend     | Node.js, Express.js               |
| Base de datos | PostgreSQL                      |
| Driver DB   | `pg` (node-postgres)              |
| Herramientas | Nodemon, dotenv                  |

---

## Funcionalidades

- Agregar, editar (doble clic) y eliminar tareas
- Marcar tareas individuales como completadas/pendientes
- Marcar todas las tareas como completadas (con modal de confirmación)
- Limpiar todas las tareas (con modal de confirmación)
- Contador de tareas pendientes
- Panel de consejos cuando no hay tareas
- Panel lateral de atajos (mostrar/ocultar)
- Popup de información del autor
- API REST completa con persistencia en PostgreSQL

---

## Estructura del Proyecto

```
TodoList/
├── backend/
│   └── db/
│       ├── schema.sql        # Esquema de la base de datos
│       └── seed.sql          # Datos de ejemplo
├── controllers/
│   └── todos.controller.js   # Lógica CRUD
├── routes/
│   └── todos.routes.js       # Definición de rutas de la API
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── img/
│       └── social/
├── db.js                     # Conexión pool de PostgreSQL
├── server.js                 # Punto de entrada de Express
├── .env                      # Variables de entorno (no se sube al repo)
├── .env_Example              # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) instalado y en ejecución

---

## Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/franco-elias505/To-do-List.git
cd To-do-List
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar `.env_Example` a `.env` y completar los valores:

```bash
cp .env_Example .env
```

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=tododb
```

### 4. Configurar la base de datos

Conectarse a PostgreSQL y crear la base de datos:

```sql
CREATE DATABASE tododb;
```

Luego ejecutar el esquema:

```bash
psql -U postgres -d tododb -f backend/db/schema.sql
```

Opcionalmente, cargar datos de ejemplo:

```bash
psql -U postgres -d tododb -f backend/db/seed.sql
```

### 5. Iniciar el servidor

```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

El servidor corre en `http://localhost:3000`.

### 6. Abrir el frontend

Abrir `frontend/index.html` con **Live Server** en VS Code o cualquier servidor de archivos estáticos.
El frontend consume la API en `http://localhost:3000`.

---

## Esquema de la Base de Datos

```sql
CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL CHECK(length(title) >= 1),
    completed   SMALLINT DEFAULT 0 CHECK(completed IN (0, 1)),
    order_index INTEGER DEFAULT 0,
    notes       TEXT,
    due_date    DATE,
    priority    SMALLINT DEFAULT 1 CHECK(priority IN (1, 2, 3)),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_id    ON todos(id);
CREATE INDEX IF NOT EXISTS idx_order ON todos(order_index);

-- Actualización automática de updated_at al modificar una fila
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

### Referencia de Columnas

| Columna       | Tipo           | Descripción                                    |
|---------------|----------------|------------------------------------------------|
| `id`          | SERIAL PK      | Clave primaria autoincremental                 |
| `title`       | VARCHAR(255)   | Texto de la tarea, mínimo 1 carácter           |
| `completed`   | SMALLINT (0/1) | `0` = pendiente, `1` = completada              |
| `order_index` | INTEGER        | Orden manual de las tareas                     |
| `notes`       | TEXT           | Notas adicionales opcionales                   |
| `due_date`    | DATE           | Fecha límite opcional                          |
| `priority`    | SMALLINT (1-3) | `1` = baja, `2` = media, `3` = alta            |
| `created_at`  | TIMESTAMP      | Se asigna automáticamente al crear             |
| `updated_at`  | TIMESTAMP      | Se actualiza automáticamente al modificar      |

---

## Referencia de la API

URL base: `http://localhost:3000/api`

| Método   | Endpoint                   | Descripción                              |
|----------|----------------------------|------------------------------------------|
| GET      | `/todos`                   | Obtener todas las tareas                 |
| POST     | `/todos`                   | Crear una nueva tarea                    |
| PUT      | `/todos/:id`               | Actualización completa de una tarea      |
| PATCH    | `/todos/:id`               | Actualización parcial de una tarea       |
| DELETE   | `/todos/:id`               | Eliminar una tarea por ID                |
| PATCH    | `/todos/complete-all`      | Marcar todas las tareas como completadas |
| DELETE   | `/todos/delete-all`        | Eliminar todas las tareas                |
| DELETE   | `/todos/completed`         | Eliminar todas las tareas completadas    |
| PATCH    | `/todos/reorder`           | Actualizar el orden de las tareas        |

### Ejemplo de Petición — Crear Tarea

```http
POST /api/todos
Content-Type: application/json

{
  "title": "Comprar víveres"
}
```

### Ejemplo de Respuesta

```json
{
  "id": 1,
  "title": "Comprar víveres",
  "completed": 0,
  "order_index": 0,
  "notes": null,
  "due_date": null,
  "priority": 1,
  "created_at": "2026-02-26T10:00:00.000Z",
  "updated_at": "2026-02-26T10:00:00.000Z"
}
```

---

## Scripts Disponibles

| Comando       | Descripción                              |
|---------------|------------------------------------------|
| `npm run dev` | Inicia el servidor con nodemon (watch)   |
| `npm start`   | Inicia el servidor con node              |

---

## Licencia

ISC
