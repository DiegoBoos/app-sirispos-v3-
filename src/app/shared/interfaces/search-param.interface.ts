import { MatPagination } from "./mat-pagination.interface";


export interface SearchParam {
    term?:   string,
    pagination?: MatPagination
}