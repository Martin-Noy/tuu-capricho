const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
// Importa tu configuración de DB si necesitas obtener datos de templates reales
// const db = require('../config/db');

exports.generateAgendaPdf = async (req, res) => {
  const { selectedSections, textColor, coverImageName } = req.body; // Recibe datos del frontend
  const coverImagePath = req.file ? req.file.path : null; // Ruta de la imagen subida por Multer

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const outputFileName = `agenda_${Date.now()}.pdf`;
  const outputPath = path.join(__dirname, '../../uploads/agendas', outputFileName); // Guarda PDFs generados

  // Asegúrate de que la carpeta exista
  if (!fs.existsSync(path.join(__dirname, '../../uploads/agendas'))) {
    fs.mkdirSync(path.join(__dirname, '../../uploads/agendas'), { recursive: true });
  }

  doc.pipe(fs.createWriteStream(outputPath));

  // 1. Añadir Carátula
  if (coverImagePath && fs.existsSync(coverImagePath)) {
    doc.image(coverImagePath, {
      fit: [doc.page.width - 100, doc.page.height - 100], // Ajustar a la página
      align: 'center',
      valign: 'center'
    });
    doc.addPage();
  } else {
    // Si no hay imagen de carátula o no se encontró
    doc.fontSize(36).text('Tuu Capricho', { align: 'center' });
    doc.fontSize(24).text('Agenda Personalizada', { align: 'center' });
    doc.text('¡Sube tu propia carátula para la próxima vez!', { align: 'center', fontSize: 16, color: 'gray' });
    doc.addPage();
  }


  // 2. Añadir Secciones y Contenido
  doc.fillColor(textColor); // Establece el color de texto para todas las secciones

  for (const item of selectedSections) {
    const { section, pages, template } = item;

    doc.fontSize(24).text(section.name, { align: 'center' });
    doc.fontSize(12).text(section.description, { align: 'center' });
    doc.moveDown();

    // Simular contenido de template. En un escenario real, cargarías el PDF del template
    // y lo fusionarías o dibujarías contenido específico.
    // PDFKit no tiene una función directa para "incluir PDF", requeriría librerías adicionales
    // como `pdf-lib` para fusionar PDFs, o dibujar contenido desde cero.
    doc.fontSize(10);
    for (let i = 0; i < (pages || 1); i++) { // Renderiza al menos una página si no es variable
      doc.text(`Página ${i + 1} de ${section.name} (Template: ${template ? template.name : 'N/A'})`, { align: 'left' });
      doc.text('____________________________________________________________________________');
      doc.moveDown();
      if (i < (pages || 1) - 1) { // No añadir página extra después de la última
        doc.addPage();
      }
    }
    doc.addPage(); // Nueva página para la siguiente sección
  }

  doc.end();

  doc.on('end', () => {
    // Una vez que el PDF está completo, envíalo de vuelta al frontend o su URL
    // Enviar el archivo como respuesta para que el frontend lo descargue
    res.sendFile(outputPath, (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
        res.status(500).send('Error al generar o enviar el PDF.');
      }
      // Opcional: eliminar el archivo temporal después de enviarlo
      // fs.unlink(outputPath, (unlinkErr) => {
      //   if (unlinkErr) console.error('Error al eliminar el PDF temporal:', unlinkErr);
      // });
    });
  });

  doc.on('error', (err) => {
    console.error('Error en PDFKit:', err);
    res.status(500).send('Error al generar el PDF.');
  });
};
