import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { CustomerService } from '../../customer.service';
import { VCliente } from '../../models/v-cliente.model';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewEditCustomerComponent } from '../../components/new-edit-customer/new-edit-customer.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './customers.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent implements OnInit { 

  private customersService = inject(CustomerService);

  public customers = signal<VCliente[]>([]);
  public term: string = '';

  @Output()
  public customerSelect = new EventEmitter<VCliente>();

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
  };

  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadData();
    initFlowbite()
  }

  loadData() {

    if (this.searchParam.term !== this.term) this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.term = this.term;
    let previousLength: number = this.searchParam.pagination!.length;
    this.customersService
      .searchCustomers(this.searchParam)
      .subscribe((resp) => {
        this.customers.set(resp.data);
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

  newCustomer(): void {

    const dialogRef = this.dialog.open(NewEditCustomerComponent, { data: { action: 'add' } });

    dialogRef.afterClosed().subscribe((result) => {
     
      if (result) {
        this.loadData();

      }
    });
  }


  editCustomer(customerId: number) {

    const dialogRef = this.dialog.open(NewEditCustomerComponent, { data: { action: 'update', customerId } });

    dialogRef.afterClosed().subscribe((result) => {
     
      if (result) {
        this.loadData();
      }
    });
  }

  listClientDownload() {
    this.customersService.getReportExcelBase64();
  }
  

  
}
