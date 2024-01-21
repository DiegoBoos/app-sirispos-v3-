import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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

  private dialog = inject(MatDialog);

  public documents = signal<DocumentEmit[]>([]);
  public term: string = '';

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
  };

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;
    this.documentService.searchDocuments(this.searchParam).subscribe((resp) => {
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
    })
  }
}
