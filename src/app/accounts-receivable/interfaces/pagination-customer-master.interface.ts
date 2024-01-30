import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { VPagoCli } from "../models/v-pagocli.model";


export interface PaginationCustomerMaster {
    pagination: MatPagination,
    data: VPagoCli[],
}