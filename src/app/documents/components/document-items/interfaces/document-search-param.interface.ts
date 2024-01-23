import { SearchParam } from "@shared/interfaces/search-param.interface";



export interface DocumentSearchParam {

    status: string;
    documentTypeCode: string;
    isDocumentItems: boolean;
    searchParam: SearchParam
}