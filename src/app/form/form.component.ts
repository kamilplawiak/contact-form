import { AfterContentInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { createMask } from '@ngneat/input-mask';
import { FormDataService } from '../form-data.service';
import { dateValidator } from '../validators/date.validator';
import { forbiddenNamesValidator } from '../validators/forbidden-names.validator';
import { FormDataModel } from '../form-data.model';
import { lastNameValidator } from '../validators/last-name.validator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  isFormSubmitted = false;
  hideRequired = true;
  editingIndex = this.dataService.getEditingIndex();
  firstNameMaxLength = 24;
  lastNameMaxLength = 32;
  addressMaxLength = 32;

  form = new FormGroup({
    'firstName': new FormControl('', [Validators.required, forbiddenNamesValidator(['Test', 'Imie'])]),
    'lastName': new FormControl('', Validators.required, lastNameValidator(this.dataService)),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'birthday': new FormControl('', [Validators.required, dateValidator]),
    'voivodeship': new FormControl('', Validators.required),
    'city': new FormControl('', Validators.required),
    'address': new FormControl('', Validators.required),
    'postalCode': new FormControl('', Validators.required),
  })

  isFormCorrect = this.form.valid;

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


  postalCodeMask = createMask({
    placeholder: '__-___',
    regex: '\\d{2}-\\d{3}'
  })

  voivodeships = ['Mazowieckie', 'Pomorskie', 'Warmińsko-mazurskie']
  cities = {
    'Mazowieckie': ['Warszawa', 'Siedlce', 'Grodzisk Mazowiecki', 'Pruszków', 'Legionowo'],
    'Pomorskie': ['Gdańsk', 'Sopot', 'Gdynia', 'Hel', 'Puck'],
    'Warmińsko-mazurskie': ['Olsztyn', 'Elbląg', 'Giżycko', 'Iława', 'Pisz']
  }

  @ViewChildren('t1, t2, t3, t4, t5, t6, t7, t8') tooltips : QueryList<NgbTooltip>;

  constructor(private dataService: FormDataService,
              private router: Router,
              private route: ActivatedRoute) {

              this.route.queryParams.subscribe((params: Params) => {
                this.isFormSubmitted = (params['show'] === 'true');
              })
            }

  ngOnInit(): void {
  }

  onInputChange(tooltip: NgbTooltip, controlName: string, target: HTMLInputElement = null) {
    const index = this.tooltips.toArray().indexOf(tooltip);

    if(target)
      target.parentElement.setAttribute('data-chars-left', ''+(target.maxLength - target.value.length));

    this.form.get(controlName).statusChanges.subscribe((status) => {
      if(status === 'INVALID' && this.form.get(controlName).dirty) tooltip.open();
      else tooltip.close();
    })

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

    if(this.dataService.getEditingIndex() >= 0) 
      this.dataService.getSubmissions()[this.dataService.getEditingIndex()].setData(this.formData);
    else
      this.dataService.addSubmission(new FormDataModel(this.formData, new Date()));

    this.isFormSubmitted = true;
    this.dataService.setEditingIndex(-1);
    this.form.reset();
  }

  onReset() {
    this.form.reset();
  }

  onEdit(index: number) {
    this.dataService.setEditingIndex(index);
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
    this.router.navigate(['/detail'], {
      relativeTo: this.route,
      queryParams: {
        id: index
      }
    })
  }
}
