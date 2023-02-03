import { AbstractControl, ValidatorFn } from "@angular/forms";

export function forbiddenNamesValidator(forbiddenNames: string[]) : ValidatorFn {
    return (control: AbstractControl) => {
        if(forbiddenNames.indexOf(control.value) >= 0)
        return {
            forbiddenName: true
        }
    }
}