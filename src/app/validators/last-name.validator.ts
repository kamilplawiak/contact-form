import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormDataService } from "../form-data.service";

export function lastNameValidator(dataService: FormDataService) : AsyncValidatorFn {
    return (control: AbstractControl) : Observable<ValidationErrors> | Promise<ValidationErrors> => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(dataService.getLastNames().indexOf(control.value) >= 0 && dataService.getEditingIndex() === -1) {
                    resolve({
                        'invalidLastName': true
                    });}
                else resolve(null);
            }, 1500)
        })
    
        return promise;
    }
}