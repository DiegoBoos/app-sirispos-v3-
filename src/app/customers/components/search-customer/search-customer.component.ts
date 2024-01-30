import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Optional,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CustomerService } from '../../customer.service';
import { VCliente } from '../../models/v-cliente.model';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SearchPaymentsComponent } from '../../../accounts-receivable/components/search-payments/search-payments.component';
import { initFlowbite } from 'flowbite';
import { NewEditCustomerComponent } from '../new-edit-customer/new-edit-customer.component';

@Component({
  selector: 'app-search-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './search-customer.component.html',
  styles: `

  `,
})
export class SearchCustomerComponent implements OnInit {

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
  
  constructor(
    public dialogRef: MatDialogRef<SearchPaymentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {

    

  }


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



  selectCustomer(customer: VCliente) {
    this.dialogRef.close({ event: 'Cancel', data: customer });
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

  editCustomer(customerId: number) {

    const dialogRef = this.dialog.open(NewEditCustomerComponent, { data: { action: 'update', customerId } });

    dialogRef.afterClosed().subscribe((result) => {
     
      if (result) {
        const { data } = result;
        this.loadData();
        // this.#customerSelect.set(data);
        // this.customerSelectEvent.emit(data);
        // this.customerSelected.set(data);
      }
    });
  
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
