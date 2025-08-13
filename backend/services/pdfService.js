// Archivo: services/pdfService.js (Ejemplo de cómo debería lucir)

import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.js';

/**
 * Ensambla un único PDF a partir de una lista de plantillas y páginas.
 * @param {Array<{section: string, template: string, pages: number}>} agendaItems
 * @param {object} customerDetails - Información del cliente
 * @param {object} coverDetails - Detalles de la portada (opcional)
 * @returns {Promise<string>} El nombre del archivo PDF generado.
 */
export async function assemblePdf(agendaItems, customerDetails, coverDetails = null) {
  console.log("🚀 ~ assemblePdf ~ agendaItems:", agendaItems);
  console.log("🚀 ~ assemblePdf ~ customerDetails:", customerDetails);
  console.log("🚀 ~ assemblePdf ~ coverDetails:", coverDetails);
  
  const finalPdfDoc = await PDFDocument.create();
  console.log("✅ PDF document created");

  // Añadir portada si se especifica
  if (coverDetails && (coverDetails.title || coverDetails.imageUrl)) {
    const coverPage = finalPdfDoc.addPage([600, 800]); // Tamaño A4 estándar
    
    // Dibujar el título de la portada
    if (coverDetails.title) {
      coverPage.drawText(coverDetails.title, {
        x: 50,
        y: 700,
        size: 32,
        color: rgb(0.2, 0.2, 0.2) // Usar la función rgb() de pdf-lib
      });
    }
    
    // Aquí se podría añadir lógica para la imagen de portada
    // Por ahora solo dibujamos el título
    console.log('✅ Portada añadida con título:', coverDetails.title);
  }

  // Corregimos la ruta base para que apunte a la carpeta PDFs montada
  const pdfsBaseDir = '/usr/src/app/PDFs';
  console.log("📁 PDFs base directory:", pdfsBaseDir);

  // Procesar cada sección de la agenda
  for (const item of agendaItems) {
    console.log("🚀 ~ assemblePdf ~ processing item:", item);
    const templatePath = path.join(pdfsBaseDir, item.section, item.template);
    console.log("🚀 ~ assemblePdf ~ templatePath:", templatePath);

    // Validar que la ruta no salga del directorio PDFs (Seguridad: Path Traversal)
    if (!templatePath.startsWith(pdfsBaseDir)) {
        throw new Error(`Security violation: Invalid path ${item.template}`);
    }

    try {
      console.log("📖 Reading template file...");
      const templateBytes = await fs.readFile(templatePath);
      console.log("✅ Template file read, size:", templateBytes.length);
      
      console.log("📄 Loading PDF template...");
      const templateDoc = await PDFDocument.load(templateBytes);
      console.log("✅ PDF template loaded, pages:", templateDoc.getPageCount());

      // Copiar la primera página del template la cantidad de veces especificada
      console.log(`🔄 Copying ${item.pages} pages from template...`);
      for (let i = 0; i < item.pages; i++) {
        const [templatePage] = await finalPdfDoc.copyPages(templateDoc, [0]);
        finalPdfDoc.addPage(templatePage);
      }
      console.log(`✅ ${item.pages} pages added from ${item.section}/${item.template}`);
    } catch (error) {
      console.error(`❌ Error processing template ${item.section}/${item.template}:`, error);
      throw new Error(`Failed to process template ${item.section}/${item.template}: ${error.message}`);
    }
  }

  console.log("💾 Saving final PDF...");
  const pdfBytes = await finalPdfDoc.save();
  console.log("✅ PDF saved, size:", pdfBytes.length);
  
  // Corregimos también la ruta del directorio de salida
  const outputDir = '/usr/src/app/generated-agendas';
  console.log("📁 Output directory:", outputDir);
  
  await fs.mkdir(outputDir, { recursive: true });
  console.log("✅ Output directory created/verified");

  const filename = `agenda-${uuidv4()}.pdf`;
  const outputPath = path.join(outputDir, filename);
  console.log("📄 Output file path:", outputPath);
  
  await fs.writeFile(outputPath, pdfBytes);
  console.log("✅ PDF file written to disk:", filename);

  return filename;
}

/**
 * Genera un PDF de previsualización en memoria.
 * @param {Array} items - Items de la agenda
 * @param {object} cover - Detalles de la portada
 * @returns {Promise<Buffer>} El buffer del PDF generado.
 */
export const assemblePreviewPdf = async (items, cover) => {
  const pdfDoc = await PDFDocument.create();

  // Añadir portada si se especifica
  if (cover && (cover.title || cover.imageUrl)) {
    const coverPage = pdfDoc.addPage([600, 800]); // Tamaño A4 estándar
    
    // Dibujar el título de la portada
    if (cover.title) {
      coverPage.drawText(cover.title, {
        x: 50,
        y: 700,
        size: 32,
        color: rgb(0.2, 0.2, 0.2) // Usar la función rgb() de pdf-lib
      });
    }
    
    // Aquí se podría añadir lógica para la imagen de portada
    // Por ahora solo dibujamos el título
    console.log('✅ Preview portada añadida con título:', cover.title);
  }

  // Corregimos la ruta base para que apunte a la carpeta PDFs montada
  const pdfsBaseDir = '/usr/src/app/PDFs';
  console.log("📁 Preview PDFs base directory:", pdfsBaseDir);

  // Procesar secciones
  for (const item of items) {
    const templatePath = path.join(pdfsBaseDir, item.section, item.template);
    console.log("📄 Preview template path:", templatePath);
    
    try {
      const templateBytes = await fs.readFile(templatePath);
      const templateDoc = await PDFDocument.load(templateBytes);
      
      // Copiar páginas del template
      for (let i = 0; i < item.pages; i++) {
        const [templatePage] = await pdfDoc.copyPages(templateDoc, [0]);
        pdfDoc.addPage(templatePage);
      }
      console.log(`✅ Preview: ${item.pages} pages added from ${item.section}/${item.template}`);
    } catch (error) {
      console.error(`❌ Preview error processing template ${item.section}/${item.template}:`, error);
      throw new Error(`Failed to process template ${item.section}/${item.template}: ${error.message}`);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

/**
 * Guarda el registro del pedido en la base de datos.
 * @param {object} orderData
 * @returns {Promise<object>} El objeto del pedido creado.
 */
export async function saveOrder(orderData) {
  const { customerDetails, agendaItems, pdfFilename, coverDetails } = orderData;
  
  try {
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      generatedPdfFilename: pdfFilename,
      agendaDefinition: {
        items: agendaItems,
        cover: coverDetails
      },
    });
    return newOrder;
  } catch (error) {
    console.error("Error saving order to database:", error);
    throw error;
  }
}