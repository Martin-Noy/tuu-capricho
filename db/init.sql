-- Este script se ejecuta al iniciar el contenedor de la base de datos por primera vez.
-- Crea la tabla 'pedidos' si no existe.

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    generated_pdf_filename VARCHAR(255),
    agenda_definition JSONB, -- Usar JSONB para un almacenamiento y consulta eficiente de JSON
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Opcional: Crear un trigger para actualizar automáticamente 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dropear el trigger si ya existe para evitar errores en reinicios
DROP TRIGGER IF EXISTS set_timestamp ON pedidos;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Mensaje de log para confirmar la ejecución
DO $$
BEGIN
  RAISE NOTICE 'Tabla "pedidos" y trigger "set_timestamp" creados/verificados.';
END $$;