import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { DocumentEmit } from "./document.interface";


export interface PaginationDocument {
    pagination: MatPagination,
    data: DocumentEmit[],
}