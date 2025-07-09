import { getAgendaStructure } from '../services/fileService.js';
import { assemblePdf, saveOrder } from '../services/pdfService.js';

export const getAvailableSections = async (req, res) => {
  try {
    const structure = await getAgendaStructure();
    res.status(200).json(structure);
  } catch (error) {
    console.error('Error in getAvailableSections controller:', error);
    res.status(500).json({ message: 'Failed to retrieve agenda sections.' });
  }
};

export const createPersonalizedAgenda = async (req, res) => {
  const { agendaItems, customerDetails } = req.body;
  console.log("🚀 ~ createPersonalizedAgenda ~ agendaItems:", agendaItems)
  console.log("🚀 ~ createPersonalizedAgenda ~ customerDetails:", customerDetails)
  if (!agendaItems || !customerDetails || !Array.isArray(agendaItems)) {
    return res.status(400).json({ message: 'Invalid request body.' });
  }
  
  // Validación del total de páginas (ej: 80)
  const totalPages = agendaItems.reduce((sum, item) => sum + item.pages, 0);
  if (totalPages !== 80) {
      return res.status(400).json({ message: `Total pages must be exactly 80, but got ${totalPages}.` });
  }

  try {
    // 1. Ensamblar el PDF
    const pdfFilename = await assemblePdf(agendaItems, customerDetails);

    // 2. Guardar el pedido en la base de datos
    const orderData = {
      customerDetails,
      agendaItems,
      pdfFilename,
    };
    const newOrder = await saveOrder(orderData);
    
    // 3. Enviar respuesta exitosa
    res.status(200).json({ 
      message: 'Agenda created and order placed successfully!',
      orderId: newOrder.id,
      fileName: pdfFilename,
    });
  } catch (error) {
    console.error('Error in createPersonalizedAgenda controller:', error);
    res.status(500).json({ message: 'Failed to create personalized agenda.' });
  }
};