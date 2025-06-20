const db = require('../config/db');

exports.getAllTemplates = async (req, res) => {
  try {
    // Lógica para obtener todos los templates
    // Puedes filtrar por section_id si los templates están asociados a secciones
    const result = await db.query('SELECT * FROM Templates ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener templates' });
  }
};

exports.getTemplatesBySectionId = async (req, res) => {
  const { sectionId } = req.params; // Suponiendo que el ID de la sección viene en la URL
  try {
    // Lógica para obtener templates por ID de sección
    const result = await db.query('SELECT * FROM Templates WHERE section_id = $1 ORDER BY name', [sectionId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener templates por sección' });
  }
};

exports.createTemplate = async (req, res) => {
  const { name, description, image_url, template_pdf_path, section_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO Templates (name, description, image_url, template_pdf_path, section_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, image_url, template_pdf_path, section_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear template' });
  }
};

// Puedes añadir exports.updateTemplate y exports.deleteTemplate si son necesarios