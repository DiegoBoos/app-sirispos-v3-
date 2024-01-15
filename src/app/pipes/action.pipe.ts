

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'action' })
export class ActionPipe implements PipeTransform {

  transform(action: string): string {
    switch (action) {
      case 'add': {
        return 'Registrar';
      }
      case 'update': {
        return 'Actualizar';
      }
      case 'delete': {
        return 'Eliminar';
      }
      default: {
        return action;
      }
    }
  }
}
