import { opendir } from 'fs/promises';
import path from 'path';

/**
 * Escanea el directorio raíz de PDFs para construir una estructura de secciones y plantillas.
 * @returns {Promise<Array<{name: string, templates: Array<{name: string, previewUrl: string}>>}>}
 */
export async function getAgendaStructure() {
  const pdfsRoot = path.resolve(process.cwd(), 'PDFs');
  const sections = [];

  try {
    const dir = await opendir(pdfsRoot);
    for await (const dirent of dir) {
      // Cada subdirectorio es una "Sección"
      if (dirent.isDirectory()) {
        const sectionName = dirent.name;
        const sectionPath = path.join(pdfsRoot, sectionName);
        const templates = [];
        const sectionDir = await opendir(sectionPath);

        for await (const templateFile of sectionDir) {
          // Cada archivo .pdf es una "Plantilla"
          if (templateFile.isFile() && path.extname(templateFile.name).toLowerCase() === '.pdf') {
            templates.push(templateFile.name);
          }
        }

        // Solo añadir la sección si contiene plantillas válidas
        if (templates.length > 0) {
          sections.push({ name: sectionName, templates });
        }
      }
    }
    return sections;
  } catch (error) {
    console.error('Error scanning PDF directory:', error);
    // Devolver un array vacío o lanzar un error para que el controlador lo maneje
    return [];
  }
}