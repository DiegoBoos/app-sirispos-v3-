import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { VCliente } from "../models/v-cliente.model";


export interface PaginationCustomer {
    pagination: MatPagination,
    data: VCliente[],
}