import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { createMask } from '@ngneat/input-mask';
import { FormDataService } from '../form-data.service';
import { dateValidator } from '../validators/date.validator';
import { forbiddenNamesValidator } from '../validators/forbidden-names.validator';
import { FormDataModel } from './form-data.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form = new FormGroup({
    'firstName': new FormControl('', [Validators.required, forbiddenNamesValidator(['Stefan', 'Paweł'])]),
    'lastName': new FormControl('', Validators.required),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'birthday': new FormControl('', [Validators.required, dateValidator]),
    'voivodeship': new FormControl('', Validators.required),
    'city': new FormControl('', Validators.required),
    'address': new FormControl('', Validators.required),
    'postalCode': new FormControl('', Validators.required),
  })

  formData = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'birthday': '',
    'voivodeship': '',
    'city': '',
    'address': '',
    'postalCode': ''
  }


  maxLengthMask = createMask({
    placeholder: '',
    regex: `[a-zA-ZąęłżźńóśĄĘŁŻŹŃÓŚ ]{1,24}`
  });
  maxLengthWithDigitsMask = createMask({
    placeholder: '',
    regex: `[0-9a-zA-ZąęłżźńóśĄĘŁŻŹŃÓŚ ]{1,24}`
  });
  postalCodeMask = createMask({
    placeholder: '__-___',
    regex: '\\d{2}-\\d{3}'
  })


  isFormCorrect = this.form.valid;
  isFormSubmitted = false;
  hideRequired = true;
  editingIndex = -1;

  voivodeships = ['Mazowieckie', 'Pomorskie', 'Warmińsko-mazurskie']
  cities = {
    'Mazowieckie': ['Warszawa', 'Siedlce', 'Grodzisk Mazowiecki', 'Pruszków', 'Legionowo'],
    'Pomorskie': ['Gdańsk', 'Sopot', 'Gdynia', 'Hel', 'Puck'],
    'Warmińsko-mazurskie': ['Olsztyn', 'Elbląg', 'Giżycko', 'Iława', 'Pisz']
  }

  @ViewChildren('t1, t2, t3, t4, t5, t6, t7, t8') tooltips : QueryList<NgbTooltip>;

  constructor(private dataService: FormDataService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isFormSubmitted = this.route.snapshot.data.show;
  }

  onInputChange(tooltip: NgbTooltip, controlName: string) {
    const index = this.tooltips.toArray().indexOf(tooltip);
    if(this.form.get(controlName).errors) this.tooltips.get(index).open();
    else this.tooltips.get(index).close();
    this.isFormCorrect = this.form.valid;
  }

  onSubmit() {
    this.formData = {
      'firstName': this.form.get('firstName').value,
      'lastName': this.form.get('lastName').value,
      'email': this.form.get('email').value,
      'birthday': this.form.get('birthday').value,
      'voivodeship': this.form.get('voivodeship').value,
      'city': this.form.get('city').value,
      'address': this.form.get('address').value,
      'postalCode': this.form.get('postalCode').value,
    }

    if(this.editingIndex >= 0) 
      this.dataService.getSubmissions()[this.editingIndex].setData(this.formData);
    else
      this.dataService.addSubmission(new FormDataModel(this.formData, new Date()));

    this.isFormSubmitted = true;
    this.editingIndex = -1;
  }

  onReset() {
    this.form.reset();
  }

  onEdit(index: number) {
    this.editingIndex = index;
    const submission = this.dataService.getSubmissions()[index];
    this.form.setValue({
      'firstName': submission.getData().firstName,
      'lastName': submission.getData().lastName,
      'email': submission.getData().email,
      'birthday': submission.getData().birthday,
      'voivodeship': submission.getData().voivodeship,
      'city': submission.getData().city,
      'address': submission.getData().address,
      'postalCode': submission.getData().postalCode,
    })
  }

  onDelete(index: number) {
    this.dataService.getSubmissions().splice(index, 1);
  }

  showDetail(index: number) {
    this.router.navigate([`/detail/${index}`], {
      relativeTo: this.route
    })
  }
}
