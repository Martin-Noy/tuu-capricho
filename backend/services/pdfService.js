import { PDFDocument } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.js';

/**
 * Ensambla un único PDF a partir de una lista de plantillas y páginas.
 * @param {Array<{section: string, template: string, pages: number}>} agendaItems
 * @returns {Promise<string>} El nombre del archivo PDF generado.
 */
export async function assemblePdf(agendaItems, customerDetails) {
  console.log("🚀 ~ assemblePdf ~ agendaItems:", agendaItems)
  const finalPdfDoc = await PDFDocument.create();

  for (const item of agendaItems) {
    console.log("🚀 ~ assemblePdf ~ item:", item)
    const templatePath = path.resolve(process.cwd(), 'PDFs', item.section, item.template);
    console.log("🚀 ~ assemblePdf ~ templatePath:", templatePath)

    // Validar que la ruta no salga del directorio PDFs (Seguridad: Path Traversal)
    const safeBaseDir = path.resolve(process.cwd(), 'PDFs');
    if (!templatePath.startsWith(safeBaseDir)) {
        throw new Error(`Security violation: Invalid path ${item.template}`);
    }

    const templateBytes = await fs.readFile(templatePath);
    const templateDoc = await PDFDocument.load(templateBytes);

    for (let i = 0; i < item.pages; i++) {
      const [templatePage] = await finalPdfDoc.copyPages(templateDoc, [0]);
      finalPdfDoc.addPage(templatePage);
    }
  }

  const pdfBytes = await finalPdfDoc.save();
  const outputDir = path.resolve(process.cwd(), 'generated-agendas');
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `agenda-${customerDetails.name.replace(/\s+/g, '-')}-${customerDetails.email}.pdf`;
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, pdfBytes);

  return filename;
}

/**
 * Guarda el registro del pedido en la base de datos.
 * @param {object} orderData
 * @returns {Promise<object>} El objeto del pedido creado.
 */
export async function saveOrder(orderData) {
  const { customerDetails, agendaItems, pdfFilename } = orderData;
  
  try {
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      generatedPdfFilename: pdfFilename,
      agendaDefinition: agendaItems, // Sequelize se encarga de serializar a JSONB
    });
    return newOrder;
  } catch (error) {
    console.error("Error saving order to database:", error);
    throw error;
  }
}