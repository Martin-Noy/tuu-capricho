esquema de base de datos : 
-- Tabla Secciones
CREATE TABLE Secciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    es_paginas_variables BOOLEAN DEFAULT FALSE,
    porcentaje_adicional DECIMAL(5, 2) DEFAULT 0.00,
    precio_base_seccion DECIMAL(10, 2) NOT NULL
);

-- Tabla Templates
CREATE TABLE Templates (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    seccion_id INTEGER NOT NULL REFERENCES Secciones(id) ON DELETE CASCADE,
    ruta_archivo_o_url TEXT NOT NULL -- Ruta al archivo PDF/imagen o URL
);

-- Tabla Pedidos
CREATE TABLE Pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id VARCHAR(255), -- Si implementas autenticación de usuarios
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tipo_pedido VARCHAR(50) NOT NULL, -- 'fisico' o 'digital'
    precio_total DECIMAL(10, 2) NOT NULL,
    datos_envio JSONB, -- Para dirección, nombre, etc.
    url_pdf_generado TEXT, -- URL si se almacena el PDF en un servicio de almacenamiento
    estado_pedido VARCHAR(50) DEFAULT 'pendiente' -- 'pendiente', 'procesando', 'completado', 'cancelado'
);

-- Tabla DetallePedido
CREATE TABLE DetallePedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES Pedidos(id) ON DELETE CASCADE,
    seccion_id INTEGER NOT NULL REFERENCES Secciones(id) ON DELETE CASCADE,
    cantidad_paginas INTEGER, -- NULO si la sección no es de páginas variables
    template_id INTEGER NOT NULL REFERENCES Templates(id) ON DELETE CASCADE,
    color_texto VARCHAR(7) -- Formato hexadecimal #RRGGBB
);

-- Ejemplo de inserción de datos iniciales (para probar)
INSERT INTO Secciones (nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion) VALUES
('Notas', 'Sección para tomar apuntes.', TRUE, 0.05, 500),
('Agenda Semanal', 'Organizador semanal.', FALSE, 0.10, 800);

INSERT INTO Templates (nombre, seccion_id, ruta_archivo_o_url) VALUES
('Rayado Clásico', 1, '/templates/notas_rayado_clasico.pdf'),
('Puntos', 1, '/templates/notas_puntos.pdf'),
('Lunes a Domingo', 2, '/templates/agenda_semanal_lunes_domingo.pdf');