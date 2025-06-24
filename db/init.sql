-- db/init.sql (Versión Final con Sincronización de Secuencias)

CREATE TABLE secciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    es_paginas_variables BOOLEAN NOT NULL,
    porcentaje_adicional NUMERIC(5, 2),
    precio_base_seccion NUMERIC(10, 2)
);

CREATE TABLE templates (
    id VARCHAR(255) PRIMARY KEY,
    id_seccion INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    url_imagen VARCHAR(255),
    FOREIGN KEY (id_seccion) REFERENCES secciones(id)
);

CREATE TABLE precios (
    id SERIAL PRIMARY KEY,
    nombre_configuracion VARCHAR(255) UNIQUE NOT NULL,
    valor NUMERIC(10, 2) NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER,
    precio_total NUMERIC(10, 2) NOT NULL,
    tipo_pedido VARCHAR(50),
    info_imagen_portada VARCHAR(255),
    color_texto VARCHAR(7),
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalles_pedido (
    id SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_seccion INTEGER NOT NULL,
    id_template VARCHAR(255),
    paginas INTEGER,
    precio_seccion NUMERIC(10, 2),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_seccion) REFERENCES secciones(id)
);

-- Inserción de datos de ejemplo
INSERT INTO precios (nombre_configuracion, valor) VALUES
('precio_base', 2000),
('precio_por_pagina_adicional', 15);

INSERT INTO secciones (id, nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion) VALUES
(1, 'Notas', 'Sección para tomar apuntes.', true, 0.05, 500),
(2, 'Calendario', 'Sección con vista mensual.', false, 0, 800)
ON CONFLICT (id) DO NOTHING; -- Evita errores si se ejecuta de nuevo

INSERT INTO templates (id, id_seccion, nombre, url_imagen) VALUES
('1-1', 1, 'Rayado Clásico', 'https://example.com/rayado.png'),
('1-2', 1, 'Punteado', 'https://example.com/punteado.png'),
('2-1', 2, 'Calendario 2024', 'https://example.com/cal2024.png')
ON CONFLICT (id) DO NOTHING; -- Evita errores si se ejecuta de nuevo

-- !! INICIO DE LA CORRECCIÓN !!
-- Sincronizar las secuencias para que los próximos IDs autogenerados no colisionen
SELECT pg_catalog.setval(pg_get_serial_sequence('secciones', 'id'), (SELECT MAX(id) FROM secciones)+1, false);
SELECT pg_catalog.setval(pg_get_serial_sequence('precios', 'id'), (SELECT MAX(id) FROM precios)+1, false);
SELECT pg_catalog.setval(pg_get_serial_sequence('pedidos', 'id'), (SELECT MAX(id) FROM pedidos)+1, false);
SELECT pg_catalog.setval(pg_get_serial_sequence('detalles_pedido', 'id'), (SELECT MAX(id) FROM detalles_pedido)+1, false);
-- !! FIN DE LA CORRECIÓN !!