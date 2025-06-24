// backend/src/controllers/pdfController.js

const PDFDocument = require('pdfkit');

exports.generatePdf = async (req, res) => {
  console.log("🚀 ~ exports.generatePdf= ~ req.body:", req.body)
  // Este bloque try...catch es la solución definitiva.
  // Atrapa cualquier error, incluyendo uno causado por una imagen inválida.
  try {
    if (!req.body.selectedSections || !req.body.textColor) {
      return res.status(400).json({ message: 'Faltan datos (secciones o color de texto).' });
    }
    
    const selectedSections = JSON.parse(req.body.selectedSections);
    console.log("🚀 ~ exports.generatePdf= ~ selectedSections:", selectedSections)
    const textColor = req.body.textColor;
    console.log("🚀 ~ exports.generatePdf= ~ textColor:", textColor)
    const coverImageFile = req.file;
    console.log("🚀 ~ exports.generatePdf= ~ coverImageFile:", coverImageFile)

    const doc = new PDFDocument({
      size: 'A5',
      autoFirstPage: false,
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=agenda.pdf');
    doc.pipe(res);

    // Portada
    doc.addPage();
    doc.fontSize(25).fillColor(textColor).text('Mi Agenda Personalizada', { align: 'center' });
    doc.moveDown(2);

    // Si la imagen es inválida, este es el punto que fallaría.
    // El 'try...catch' nos protege.
    if (coverImageFile && coverImageFile.buffer) {
      doc.image(coverImageFile.buffer, {
        fit: [300, 400],
        align: 'center',
        valign: 'center',
      });
    }

    // Secciones
    selectedSections.forEach(sectionItem => {
      doc.addPage();
      doc.fontSize(20).fillColor(textColor).text(sectionItem.section.name, { underline: true });
      doc.moveDown();
      for (let i = 1; i <= sectionItem.pages; i++) {
        doc.fontSize(10).fillColor('#333').text(`Página ${i} de la sección`);
        if (i < sectionItem.pages) {
          doc.addPage();
        }
      }
    });

    doc.end();

  } catch (error) {
    // Si llegamos aquí, es porque algo falló (probablemente la imagen).
    console.error('ERROR DEFINITIVO ATRAPADO:', error); // <-- ESTE LOG ES EL QUE NECESITAMOS
    
    // Enviamos una respuesta de error controlada.
    if (!res.headersSent) {
      res.status(500).json({ message: 'No se pudo generar el PDF. Revisa la consola del backend para más detalles.' });
    }
  }
};