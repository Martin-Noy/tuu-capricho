// Archivo: agendaController.js (Modificado)

import { getAgendaStructure } from '../services/fileService.js';
//---> 1. Importamos la nueva función que vamos a crear en pdfService
import { assemblePdf, saveOrder, assemblePreviewPdf } from '../services/pdfService.js';

export const getAvailableSections = async (req, res) => {
  try {
    const structure = await getAgendaStructure();
    res.status(200).json(structure);
  } catch (error) {
    console.error('Error in getAvailableSections controller:', error);
    res.status(500).json({ message: 'Failed to retrieve agenda sections.' });
  }
};

//---> 2. ¡NUEVO MÉTODO! Este es el que usará el botón de previsualización.
export const previewPersonalizedAgenda = async (req, res) => {
  console.log('🔍 Preview request body:', JSON.stringify(req.body, null, 2));
  
  const { coverDetails, items } = req.body;

  console.log('🔍 Extracted coverDetails:', coverDetails);
  console.log('🔍 Extracted items:', items);
  console.log('🔍 Items type:', typeof items);
  console.log('🔍 Items isArray:', Array.isArray(items));

  // Corregimos la validación para que coincida con la estructura del frontend
  if (!items || !Array.isArray(items)) {
    console.log('❌ Validation failed: items is not valid');
    return res.status(400).json({ 
      message: 'Invalid request body for preview.',
      received: { coverDetails, items },
      expected: 'items should be an array'
    });
  }

  try {
    console.log('✅ Validation passed, calling assemblePreviewPdf');
    // a. Llamamos a una nueva función en el servicio que genera el PDF en memoria
    const pdfBuffer = await assemblePreviewPdf(items, coverDetails);

    console.log('✅ PDF generated successfully, size:', pdfBuffer.length);

    // b. Configuramos las cabeceras de la respuesta para que el navegador la interprete como un PDF
    res.setHeader('Content-Type', 'application/pdf');
    // 'inline' le dice al navegador que intente mostrarlo en la página, no que lo descargue.
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');

    // c. Enviamos el buffer del PDF como respuesta.
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error in previewPersonalizedAgenda controller:', error);
    res.status(500).json({ message: 'Failed to generate agenda preview.' });
  }
};


// (Este método se mantiene igual, pero ahora incluimos coverDetails)
export const createPersonalizedAgenda = async (req, res) => {
  console.log('🚀 Generate agenda request body:', JSON.stringify(req.body, null, 2));
  
  // Corregimos para que coincida con la estructura del frontend
  const { coverDetails, items, customerDetails } = req.body;
  
  console.log('🚀 Extracted data:', { coverDetails, items, customerDetails });
  console.log('🚀 Items type:', typeof items);
  console.log('🚀 Items isArray:', Array.isArray(items));
  console.log('🚀 CustomerDetails:', customerDetails);

  // Validación mejorada
  if (!items || !Array.isArray(items)) {
    console.log('❌ Validation failed: items is not valid');
    return res.status(400).json({ 
      message: 'Invalid request body: items must be an array',
      received: { coverDetails, items, customerDetails }
    });
  }

  if (!customerDetails || !customerDetails.name || !customerDetails.email) {
    console.log('❌ Validation failed: customerDetails is not valid');
    return res.status(400).json({ 
      message: 'Invalid customer details: name and email are required',
      received: { customerDetails }
    });
  }
  
  // Validación de páginas más flexible
  const totalPages = items.reduce((sum, item) => sum + (item.pages || 0), 0);
  console.log('🚀 Total pages calculated:', totalPages);
  
  if (totalPages !== 80) {
    console.log('❌ Page validation failed: expected 80, got', totalPages);
    return res.status(400).json({ 
      message: `Total pages must be exactly 80, but got ${totalPages}.`,
      received: { totalPages, items }
    });
  }

  try {
    console.log('✅ All validations passed, calling assemblePdf');
    // 1. Ensamblar el PDF final (ahora pasamos también los detalles de la portada)
    const pdfFilename = await assemblePdf(items, customerDetails, coverDetails);
    
    console.log('✅ PDF assembled successfully:', pdfFilename);

    // 2. Guardar el pedido en la base de datos
    const orderData = {
      customerDetails,
      coverDetails, // También guardamos la info de la portada en el pedido
      agendaItems: items, // Convertimos items a agendaItems para el servicio
      pdfFilename,
    };
    
    console.log('✅ Saving order to database...');
    const newOrder = await saveOrder(orderData);
    console.log('✅ Order saved successfully:', newOrder.id);
    
    // 3. Enviar respuesta exitosa
    res.status(200).json({ 
      message: 'Agenda created and order placed successfully!',
      orderId: newOrder.id,
      fileName: pdfFilename,
    });
  } catch (error) {
    console.error('❌ Error in createPersonalizedAgenda controller:', error);
    res.status(500).json({ 
      message: 'Failed to create personalized agenda.',
      error: error.message 
    });
  }
};