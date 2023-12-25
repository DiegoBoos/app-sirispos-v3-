import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UnitCode } from '@shared/models/unit-code.model';
import { UnitCodeService } from '@shared/services/unit-code.service';

@Component({
  selector: 'app-search-unit-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './search-unit-code.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchUnitCodeComponent { 

  private unitCodeService = inject(UnitCodeService);

  public unitCodes = computed(() => this.unitCodeService.unitCodes());

  public filteredItems: UnitCode[] = [];

  public term: string = '';

  public selectedUnitCode?: UnitCode;

  constructor(
    public dialogRef: MatDialogRef<SearchUnitCodeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {

    effect(()=>{
      this.filteredItems = this.unitCodes();
    })

  }


  closeDialog(): void {
    
    this.dialogRef.close({ event: 'Cancel', data: this.selectedUnitCode });
  }

  selectUnitCode(unitCode: UnitCode) {
    this.dialogRef.close({ event: 'Cancel', data: unitCode });
  }

  filterItems(): void {
    if (this.term.length > 1) {
      this.filteredItems = this.unitCodes().filter(item => item.code.toLowerCase().includes(this.term.toLowerCase()) ||  item.description.toLowerCase().includes(this.term.toLowerCase()));
    } else {
      this.filteredItems = this.unitCodes();
    }
  }

}
