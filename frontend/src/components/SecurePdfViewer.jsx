// El visor de PDF que impide la descarga directa.
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const SecurePdfViewer = ({ filename }) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  // URL para obtener el PDF desde el backend
  const pdfUrl = `http://localhost:8000/api/pdfs/${filename}`;

  // Función para transformar la barra de herramientas y eliminar botones
  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const {
          CurrentPageInput,
          Download, // <-- Botón a eliminar
          EnterFullScreen, // <-- Botón a eliminar
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          Print, // <-- Botón a eliminar
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px', backgroundColor: '#eee' }}>
            <div style={{ padding: '0px 2px' }}> <GoToPreviousPage /> </div>
            <div style={{ padding: '0px 2px', display: 'flex', alignItems: 'center' }}>
              <CurrentPageInput /> / <NumberOfPages />
            </div>
            <div style={{ padding: '0px 2px' }}> <GoToNextPage /> </div>
            <div style={{ padding: '0px 2px', marginLeft: 'auto' }}> <ZoomOut /> </div>
            <div style={{ padding: '0px 2px' }}> <ZoomIn /> </div>
          </div>
        );
      }}
    </Toolbar>
  );

  return (
    <div style={{ flex: '1', overflow: 'auto' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfUrl} plugins={[toolbarPluginInstance]} renderToolbar={renderToolbar} />
      </Worker>
    </div>
  );
};

export default SecurePdfViewer;