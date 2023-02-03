import { Injectable } from "@angular/core";
import { FormDataModel } from "./form-data.model";

@Injectable({
    providedIn: 'root'
})
export class FormDataService {
    private formSubmissions: FormDataModel[] = [];

    public getSubmissions() : FormDataModel[] {
        return this.formSubmissions;
    }

    public addSubmission(submission: FormDataModel) {
        this.formSubmissions.push(submission);
    }
}