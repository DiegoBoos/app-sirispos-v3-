import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { VCliente } from '../../models/v-cliente.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SearchCustomerComponent } from '../search-customer/search-customer.component';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div
      class="mt-4 flex bg-blue-100 h-14 items-center rounded border border-solid border-gray-300 p-4"
    >
      <div class="flex items-center">
        <!-- Sección Cliente -->
        <p class="pl-1 mr-2">Cliente:</p>

        @if (customerSelected().cliente_id) {
        <p class="mb-0 text-gray-500 dark:text-gray-400 text-sm">
          <strong class="font-semibold text-gray-900 dark:text-white">
            {{ customerSelected().nombre_comercial }}
          </strong>
        </p>

        }

        <button
          (click)="openDialog()"
          type="button"
          class=" ml-4 mt-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Seleccionar
        </button>

        @if (customerSelected().cliente_id) {
        <p class=" ml-auto text-gray-500 dark:text-gray-400 text-sm">
          <strong class="font-semibold text-gray-900 dark:text-white">
            {{ customerSelected().tipo_doc }} :
          </strong>
          {{ customerSelected().identificacion }}-{{
            customerSelected().digito_verificacion
          }}
        </p>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomerComponent {
  
  public customerSelected = signal<VCliente>(new VCliente());
  private dialog = inject(MatDialog);

  @Output() customerSelectEvent = new EventEmitter<VCliente>();

  #customerSelect = signal<VCliente>(new VCliente());
  public customerSelect = computed(() => this.#customerSelect());

  openDialog(): void {

    const dialogRef = this.dialog.open(SearchCustomerComponent);
    dialogRef.afterClosed().subscribe((result) => {
     
      if (result) {
        const { data } = result;
        this.#customerSelect.set(data);
        this.customerSelectEvent.emit(data);
        this.customerSelected.set(data);
      }
    });
  }

}
