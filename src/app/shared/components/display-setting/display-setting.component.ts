import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingService } from '../../../setting/setting.service';

@Component({
  selector: 'app-display-setting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Datos de la Empresa -->
    <div class="basis-10/12">
      <p class="mb-0 text-gray-500 dark:text-gray-400">
        <strong class="font-semibold text-gray-900 dark:text-white">
          {{ settingService.seeting().nombre_comercial }}
        </strong>
        {{ settingService.seeting().codigo_alterno }}:
        {{ settingService.seeting().identificacion }}-
        {{ settingService.seeting().digito_verificacion }}
      </p>
      <p class="mb-0 text-gray-500 dark:text-gray-400 text-sm">
        <strong class="font-semibold text-gray-900 dark:text-white">
          Dirección:
        </strong>
        {{ settingService.seeting().direccion1 }} -
        {{ settingService.seeting().municipio }},
        {{ settingService.seeting().departamento }},
        {{ settingService.seeting().pais }}
      </p>
      <p class="mb-0 text-gray-500 dark:text-gray-400 text-sm">
        <strong class="font-semibold text-gray-900 dark:text-white">
          Teléfono:
        </strong>
        {{ settingService.seeting().telefono }}
      </p>

      <p class="mb-0 text-gray-500 dark:text-gray-400 text-sm">
        <strong class="font-semibold text-gray-900 dark:text-white">
          e-mail:
        </strong>
        {{ settingService.seeting().email }}
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplaySettingComponent {

  public settingService = inject(SettingService);

}
