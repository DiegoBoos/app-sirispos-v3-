import { User } from "../../auth/interfaces/user.interface";
import { Pedido } from "../../pedidos/interfaces/pedido.interface";


export interface PositionInfo {

    position: google.maps.LatLngLiteral;
    user: User;
    pedido?: Pedido;

}