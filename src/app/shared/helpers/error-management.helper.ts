import Swal from "sweetalert2";

import { DBErrorCodes } from "@shared/interfaces/db-error-codes";


export const ErrorMagement = (err: any) => {

    // ErrorsDB
    if (err.error.cause) {
        const error = err.error.cause;
        const { code = '' } = error;
        const errorMessage = error.code ? `${getDbErrorMessage(code)}` : Array.isArray(error.message) ? error.message.join('; ') : error.message;
        Swal.fire('Error', errorMessage, 'error');
        // console.log(errorMessage);
        
        return;
    }

    //Errors Array
    if ( err.error instanceof Array ) {
        const error = err.error;
        let errorMessage = '';
        error.map( (msg: any) => {
            errorMessage = `${errorMessage}${JSON.stringify(msg)} `;
        })
        // console.log(errorMessage);
        
        Swal.fire('Error', errorMessage, 'error');
        return;
    }

    //Errors Message Array
    if ( err.error.message instanceof Array ) {
        const error = err.error.message;
        const errorMessage = `${error.join('; ')} `;
        Swal.fire('Error', errorMessage, 'error');
        // console.log(errorMessage);
        return;
    }

    // Errors Message
    if (err.error.message) {
        const errorMessage = err.error.message;
        Swal.fire('Error', errorMessage, 'error');
        // console.log(errorMessage);
        return;
    }

}

const getDbErrorMessage = (code: string): string => {
    const errorMessage = DBErrorCodes[code as keyof typeof DBErrorCodes];
    return errorMessage || 'Error desconocido';
}