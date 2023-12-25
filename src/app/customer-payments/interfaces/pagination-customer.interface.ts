import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { VPagoCliDetalle } from "../models/v-pagocli-detalle.model";


export interface PaginationCustomer {
    pagination: MatPagination,
    data: VPagoCliDetalle[],
}