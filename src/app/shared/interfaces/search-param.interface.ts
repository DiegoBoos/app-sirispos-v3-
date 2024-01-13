import { MatPagination } from "./mat-pagination.interface";


export interface SearchParam {
    term?:   string,
    dateFrom?: string,
    dateTo?: string,
    pagination?: MatPagination
}