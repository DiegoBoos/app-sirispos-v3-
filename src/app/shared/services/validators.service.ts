import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  // Validatin Forms

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'min':
          return 'Valor NO Válido ';
        case 'max':
          return 'Valor NO Válido ';
        case 'required':
          return 'Requerido *';
        case 'notValidDate':
          return 'Fecha No Válida';
        case 'notValidPay':
          return 'Valor No Válido';
        case 'email':
          return 'Correo no válido *';
      }
    }

    return null;
  }

  public dueDateValidator(issueDate: string, dueDate: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const issueDateValue = formGroup.get(issueDate)?.value;
      const dueDateValue = formGroup.get(dueDate)?.value;

      if (new Date(issueDateValue) > new Date(dueDateValue)) {
        formGroup.get(dueDate)?.setErrors({ notValidDate: true });

        return { notValidDate: true };
      }

      formGroup.get(dueDate)?.setErrors(null);

      return null;
    };
  }

  public operationTypeValidator(
    operationType: string,
    discrepancyResponse: string
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const operationTypeValue = formGroup.get(operationType)?.value;
      const discrepancyResponseValue =
        formGroup.get(discrepancyResponse)?.value;

      if (
        operationTypeValue !== '22' &&
        operationTypeValue !== '32' &&
        !discrepancyResponseValue
      ) {
        formGroup.get(discrepancyResponse)?.setErrors({ required: true });

        return { required: true };
      }

      formGroup.get(discrepancyResponse)?.setErrors(null);

      return null;
    };
  }

  public tipoPersonaValidator(
    tipoPersonaId: string, apellido1: string, nombre1: string, tributaryIdentificationName: string
  ) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const tipoPersonaIdValue = +formGroup.get(tipoPersonaId)?.value;
      const nombre1Value = formGroup.get(nombre1)?.value;
      const apellido1Value = formGroup.get(apellido1)?.value;
      const tributaryIdentificationNameValue = formGroup.get(tributaryIdentificationName)?.value;

      if (tipoPersonaIdValue === 2 && apellido1Value.trim()==='') {
        formGroup.get(apellido1)?.setErrors({ required: true });
      }
      if (tipoPersonaIdValue === 2 && nombre1Value.trim()==='') {
        formGroup.get(nombre1)?.setErrors({ required: true });
      }
      if (tipoPersonaIdValue === 1 && tributaryIdentificationNameValue.trim()==='') {
        formGroup.get(tributaryIdentificationName)?.setErrors({ required: true });
      }


      return null;
    };
  }

  public payValueValidator (saldo: string, payVal: string, discountVal: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {
      const saldoValue = +formGroup.get(saldo)?.value;
      const payValue = +formGroup.get(payVal)?.value;
      const discountValue = +formGroup.get(discountVal)?.value;

      if (saldoValue < (payValue + discountValue)) {
        formGroup.get(payVal)?.setErrors({ notValidPay: true });
        return { notValidPay: true };
      }
      return null;
    };

  }

  public payRegisterValidator (saldo: string, payVal: string, discountVal: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {
      const saldoValue = +formGroup.get(saldo)?.value;
      const payValue = +formGroup.get(payVal)?.value;
      const discountValue = +formGroup.get(discountVal)?.value;

      if (saldoValue < (payValue + discountValue)) {
        formGroup.get(payVal)?.setErrors({ notValidPay: true });
        return { notValidPay: true };
      }
      return null;
    };

  }
}
