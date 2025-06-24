const db = require('../config/db');

exports.getAllSections = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Secciones ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener secciones' });
  }
};

exports.createSection = async (req, res) => {
  const { nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion } = req.body;
  console.log(`🚀 ~ exports.createSection= ~ { nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion }:`, { nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion });
  try {
    const result = await db.query(
      'INSERT INTO Secciones (nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, es_paginas_variables, porcentaje_adicional, precio_base_seccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear sección' });
  }
};