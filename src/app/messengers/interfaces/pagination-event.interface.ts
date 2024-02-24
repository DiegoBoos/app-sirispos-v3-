import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { MessengerEvent } from "../models/messenger-event.model";

export interface PaginationEvent {
    pagination: MatPagination,
    data: MessengerEvent[],
}