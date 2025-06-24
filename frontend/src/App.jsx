// El componente principal que orquesta toda la aplicación.
import React, { useState } from 'react';
import PdfGallery from './components/PdfGallery';
import SecurePdfViewer from './components/SecurePdfViewer';
import OrderForm from './components/OrderForm';

function App() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [pdfToOrder, setPdfToOrder] = useState(null);

  const handlePreview = (filename) => {
    setSelectedPdf(filename);
  };

  const handleCloseViewer = () => {
    setSelectedPdf(null);
  };
  
  const handleOrderClick = (filename) => {
    setPdfToOrder(filename);
    setIsOrdering(true);
  };

  const handleCloseForm = () => {
      setIsOrdering(false);
      setPdfToOrder(null);
  }

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center' }}>
        <h1>Tuu-capricho</h1>
        <p>Selecciona un diseño para previsualizar o encargar tu agenda personalizada.</p>
      </header>

      <main>
        <PdfGallery onPreview={handlePreview} onOrder={handleOrderClick} />

        {isOrdering && (
            <div className="form-container">
                <h2>Realizar Pedido para: {pdfToOrder}</h2>
                <OrderForm pdfFilename={pdfToOrder} onOrderSuccess={handleCloseForm} />
                <button onClick={handleCloseForm} className="btn btn-secondary" style={{marginTop: '1rem'}}>Cancelar</button>
            </div>
        )}
      </main>

      {selectedPdf && (
        <div className="viewer-modal">
            <div className="viewer-content">
                 <div className="viewer-header">
                     <button onClick={handleCloseViewer} className="btn">Cerrar Visor</button>
                 </div>
                <SecurePdfViewer filename={selectedPdf} />
            </div>
        </div>
      )}
    </div>
  );
}

export default App;