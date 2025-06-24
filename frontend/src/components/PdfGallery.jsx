// Muestra la lista de PDFs disponibles obtenidos de la API.
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PdfGallery = ({ onPreview, onOrder }) => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        // La URL de la API del backend
        const response = await axios.get('http://localhost:8000/api/pdfs');
        setPdfFiles(response.data.files);
      } catch (err) {
        setError('No se pudieron cargar los archivos PDF. Asegúrate de que el servidor backend esté funcionando.');
        console.error(err);
      }
    };

    fetchPdfs();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
        <h2>Nuestros Diseños</h2>
        <div className="pdf-gallery">
        {pdfFiles.length > 0 ? (
            pdfFiles.map((filename) => (
            <div key={filename} className="pdf-item">
                <p>{filename}</p>
                <button onClick={() => onPreview(filename)} className="btn" style={{marginRight: '10px'}}>Previsualizar</button>
                <button onClick={() => onOrder(filename)} className="btn btn-secondary">Encargar</button>
            </div>
            ))
        ) : (
            <p>No hay diseños disponibles en este momento.</p>
        )}
        </div>
    </div>
  );
};

export default PdfGallery;