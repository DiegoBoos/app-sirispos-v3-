import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
  
    // Guarda el archivo en formato blob
    XLSX.writeFile(wb, fileName, { bookType: 'xlsx', type: 'file' });

  }

}
