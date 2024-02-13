import { MatPagination } from "@shared/interfaces/mat-pagination.interface";
import { Pedido } from "./pedido.interface";



export interface PaginationPedido {
    pagination: MatPagination,
    data: Pedido[],
}