import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormDataService } from '../form-data.service';
import { FormDataModel } from '../form-data.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  formSubmissions: FormDataModel[] = [];
  activeRow: FormDataModel;
  index: number;

  constructor(private dataService: FormDataService,
              private router: Router,
              private route: ActivatedRoute) {

              this.route.queryParams.subscribe((params: Params) => {
                this.index = params['id'];
              })
            }

  ngOnInit(): void {
    this.formSubmissions = this.dataService.getSubmissions();
    this.activeRow = this.formSubmissions[this.index];
  }

  navigateBack() {
    this.router.navigate(['/'], {
      relativeTo: this.route,
      queryParams: {
        show: true
      }
    });
  }
}
