import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { Messenger } from "../models/messenger.model";



export interface PaginationMessenger {
    pagination: MatPagination,
    data: Messenger[],
}