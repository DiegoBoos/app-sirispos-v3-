import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DocumentService } from '../../document.service';
import { DocumentEmit } from '../../interfaces/document.interface';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../../pipes/pipes.module';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PopupInfoComponent } from '@shared/components/popup-info/popup-info.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { format } from 'date-fns';
import { InvoiceTypeService } from '@shared/services/invoice-type.service';
import { InvoiceType } from '@shared/models/invoice-type.model';
import { DocumentStauts } from '../../components/document-items/interfaces/document-status.interface';
import { DocumentSearchParam } from '../../components/document-items/interfaces/document-search-param.interface';

@Component({
  selector: 'app-documents-query',
  standalone: true,
  imports: [CommonModule, FormsModule, PipesModule, MatDialogModule],
  templateUrl: './documents-query.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsQueryComponent implements OnInit {
  @BlockUI() blockUI?: NgBlockUI;
  private documentService = inject(DocumentService);
  private invoiceTypeService = inject(InvoiceTypeService);
  public invoiceTypes = computed(() => this.invoiceTypeService.invoiceTypes());

  private dialog = inject(MatDialog);

  public documents = signal<DocumentEmit[]>([]);
  public invoiceTypesFilter: InvoiceType[] = [];
  public maxDate: Date = new Date();
  public dateFrom: string = format(
    new Date(new Date().getFullYear(), 0, 1),
    'yyyy-MM-dd'
  );
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');
  public term: string = '';
  public typeServiceCode: string = 'A';
  public status: string = 'A';

  documentStatus: DocumentStauts[] = [
    {
      code: 'A',
      description: 'Todos los estados',
    },
    {
      code: 'E',
      description: 'Con Error',
    },
    {
      code: 'N',
      description: 'No emitidos',
    },
  ];

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10000,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
    dateFrom: '',
    dateTo: '',
  };

  documentSearchParam: DocumentSearchParam = {
    status: 'A',
    documentTypeCode: 'A',
    isDocumentItems: false,
    searchParam: this.searchParam,
  };

  constructor() {
    effect(() => {
      this.invoiceTypesFilter = [];
      this.invoiceTypesFilter = this.invoiceTypes();
      const invoiceType: InvoiceType = {
        code: 'A',
        description: 'Todos los tipos de documento',
        operationTypes: [],
      };
      this.invoiceTypesFilter.push(invoiceType);
    });
  }

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;

    this.documentSearchParam.searchParam = this.searchParam;
    this.documentSearchParam.documentTypeCode = this.typeServiceCode;
    this.documentSearchParam.status = this.status;

    this.documentService
      .searchDocuments(this.documentSearchParam)
      .subscribe((resp) => {
        this.documents.set(resp.data);
        const { length, pageIndex, pageSize, pages } = resp.pagination;
        this.searchParam.pagination = {
          length: +length,
          pageIndex: +pageIndex,
          pageSize: +pageSize,
          pages: +pages,
        };
        if (previousLength !== this.searchParam.pagination.length)
          this.searchParam.pagination.pageIndex = 0;
      });
  }

  onChange(e: any) {
    const code = e.value;
    this.typeServiceCode = code;
  }

  previousPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex > 0) {
      this.searchParam.pagination!.pageIndex--;
    }
    this.loadData();
  }

  nextPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex < this.searchParam.pagination!.pages) {
      this.searchParam.pagination!.pageIndex++;
    }
    this.loadData();
  }

  printDocument(cufe: string) {
    this.documentService.getDocument(cufe);
  }

  documentEmit(id: string) {
    this.blockUI!.start('Generando documento electrónico ...');
    this.documentService.emitDocument(id).subscribe((resp) => {
      this.blockUI?.stop();
      if (resp) {
        Swal.fire(
          'Transacción Exitosa.',
          'Documento generado correctamente.',
          'success'
        );
        this.loadData();
      }
    });
  }

  viewError(documentEmit: DocumentEmit) {
    const data = documentEmit.responseEmit?.message;
    const dialogRef = this.dialog.open(PopupInfoComponent, {
      data: { data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  listDocumentDownload(isDocumentItems: boolean) {

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;

    this.documentSearchParam.searchParam = this.searchParam;
    this.documentSearchParam.documentTypeCode = this.typeServiceCode;
    this.documentSearchParam.status = this.status;
    this.documentSearchParam.isDocumentItems = isDocumentItems;

    this.documentService.getReportExcelBase64(this.documentSearchParam);
  }
}
