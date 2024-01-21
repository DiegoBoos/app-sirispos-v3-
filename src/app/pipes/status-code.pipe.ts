

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statuscode' })
export class StatusCodePipe implements PipeTransform {

  transform(statusCode: string): string {
    switch (statusCode) {
      case '201': {
        return 'Emitido';
      }
      case 'NE': {
        return 'No Emitido';
      }
      default: {
        return 'Con error';
      }
    }
  }
}
