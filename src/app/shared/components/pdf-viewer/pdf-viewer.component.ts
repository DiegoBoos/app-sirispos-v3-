import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { downloadPdf } from '@utils/download-blob';
import { initFlowbite } from 'flowbite';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  template: `
    <div class="top-10 h-full max-w-[800px] flex items-center justify-center dark:bg-gray-700">
      <!-- <div class="modal-overlay absolute w-full h-full max-w-xl" > -->
      <div class="relative p-4 w-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-2 border-b rounded-t dark:border-gray-600"
          >
            <button title="Descargar Comprobante" type="button" (click)="downloadReport()" class="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500">
              <svg
                class="icon icon-tabler icon-tabler-download"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
              </svg>
            </button>


            <button title="Imprimir Comprobante" type="button" (click)="printReport()" class="pl-4 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-500">
              <svg
                class="icon icon-tabler icon-tabler-printer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"
                />
                <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                <path
                  d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"
                />
              </svg>
            </button>
           

            <button
              type="button"
              (click)="closeDialog()"
              class="end-2.5 text-gray-400 bg-transparent hover:bg-blue-200 hover:text-blue-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5">
            <pdf-viewer
              [src]="pdfSrc"
              [rotation]="0"
              [original-size]="false"
              [show-all]="true"
              [fit-to-page]="false"
              [zoom]="0"
              [zoom-scale]="'page-width'"
              [stick-to-page]="false"
              [render-text]="true"
              [external-link-target]="'blank'"
              [autoresize]="false"
              [show-borders]="false"
              (after-load-complete)="onLoaded($event)"
              style="width: 700px; height: 500px"
            >
            </pdf-viewer>
          </div>
        </div>
      </div>
    </div>
  `,
 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent implements OnInit {

  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  pdfSrc: any;
  fileName: string = '';

  isPdfLoaded = false;
  private pdf!: PDFDocumentProxy;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { base64, fileName } = obj;

    this.fileName = fileName;
    this.pdfSrc = `data:application/pdf;base64,${base64}`;
  }
  ngOnInit(): void {
    initFlowbite();
  }

  downloadReport(): void {
    downloadPdf(this.pdfSrc, this.fileName);
  }

  printReport() {
    this.pdf.getData().then((u8: any) => {
        let blob = new Blob([u8.buffer], {
            type: 'application/pdf'
        });
        const blobUrl = window.URL.createObjectURL((blob));
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow!.print();
    });
  }

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
