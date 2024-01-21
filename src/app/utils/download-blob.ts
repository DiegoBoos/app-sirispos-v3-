import { HttpResponse } from "@angular/common/http";


export const downloadBlob = (response: HttpResponse<Blob>): void => {

  const headers = response.headers;

  const type = headers.get('Content-Type')!;

  const contentDispositionHeader = headers.get('Content-Disposition')!;

  const fileName = GetFilenameHeader(contentDispositionHeader);

  const blob = new Blob([response.body!], { type });

  const urlBlob = URL.createObjectURL(blob);

  // Crea un enlace para forzar la descarga
  const a = document.createElement('a');
  a.href = urlBlob;
  a.download = fileName;

  // Simula un click en el enlace
  a.click();

  // Limpia el objeto URL creado
  URL.revokeObjectURL(urlBlob);
}

function GetFilenameHeader(conteDispositionHeader: string): string {

  const regex = /filename="([^"]+)"/;
  const matches = regex.exec(conteDispositionHeader);

  let filename: string = '';

  if (matches && matches.length >= 2) {
    filename = matches[1];
  } else {
    filename = generateNameFile();
  }
  return filename;
}

export const downloadPdf = (base64: any, fileName: string): void => {
  const link = document.createElement('a');
  link.href = base64;
  link.download = `${fileName}.pdf`; // Nombre del archivo a descargar
  link.click();
}

function generateNameFile() {
  const extension = 'dat';
  const dateNow = new Date();
  const day = String(dateNow.getDate()).padStart(2, '0');
  const month = String(dateNow.getMonth() + 1).padStart(2, '0'); // Los monthes se indexan desde 0
  const year = dateNow.getFullYear();
  const hour = String(dateNow.getHours()).padStart(2, '0');
  const minute = String(dateNow.getMinutes()).padStart(2, '0');
  const second = String(dateNow.getSeconds()).padStart(2, '0');

  const fileName = `${year}${month}${day}_${hour}${minute}${second}${extension}`;
  return fileName;
}