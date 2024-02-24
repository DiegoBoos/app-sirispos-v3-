

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'active' })
export class ActivePipe implements PipeTransform {

  transform(active: number): string {
    switch (active) {
      case 0: {
        return 'Inactivo';
      }
      case 1: {
        return 'Activo';
      }
      default: {
        return '';
      }
    }
  }
}
