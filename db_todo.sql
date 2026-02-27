-- Crear tabla todos
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
CREATE INDEX IF NOT EXISTS idx_id ON todos(id);
CREATE INDEX IF NOT EXISTS idx_order ON todos(order_index);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que usa la función
CREATE OR REPLACE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();