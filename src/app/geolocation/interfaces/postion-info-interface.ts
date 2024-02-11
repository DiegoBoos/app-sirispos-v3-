import { User } from "../../auth/interfaces/user.interface";


export interface PositionInfo {

    position: google.maps.LatLngLiteral;
    user: User

}