import { Injectable } from "@angular/core";
import { FormDataModel } from "./form-data.model";

@Injectable({
    providedIn: 'root'
})
export class FormDataService {
    private formSubmissions: FormDataModel[] = [];
    private editingIndex: number = -1;

    public getEditingIndex() : number {
        return this.editingIndex;
    }

    public getSubmissions() : FormDataModel[] {
        return this.formSubmissions;
    }

    public setEditingIndex(n: number) {
        this.editingIndex = n;
    }

    public addSubmission(submission: FormDataModel) {
        this.formSubmissions.push(submission);
    }

    public getLastNames() : string[] {
        const arr: string[] = [];
        for(const submission of this.formSubmissions) {
            arr.push(submission.getData().lastName);
        }

        return arr;
    }
}