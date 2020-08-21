import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { RestService } from '../../_services/rest.service';

import { Application } from 'src/app/models/application';
import { ApplicationService } from '../../_services/application.service';
import { HttpErrorResponse } from '@angular/common/http';

export class User {
    public name: string;
    public email: string;
    public password: string;
    public hobbies: string;
  }

@Component({
    selector: 'app-form-body-application',
    templateUrl: './form-body-application.component.html',
    styleUrls: ['./form-body-application.component.scss']
})
export class FormBodyApplicationComponent implements OnInit, OnDestroy {
    @Input() submitButton: string;
    public payLoad = '';
    public applicationsSubscription: Subscription;
    public errorMessage: string;
    public errorMessages: any;
    public errorFields: string[];
    public formFailedSubmit: boolean = false;
    private id: number;

    application = new Application();
    model = new User();

    constructor(
        private restService: RestService,
        private applicationService: ApplicationService,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.translate.use('da');
        this.id = +this.route.snapshot.paramMap.get('id');
        if (this.id) {
            this.getApplication(this.id);
        }
    }

    getApplication(id: number): void {
        this.applicationsSubscription = this.restService
            .get('application', {}, id)
            .subscribe((application: Application) => {
                this.application = application;
            });
    }

    onSubmit(): void {
        if (this.id) {
            this.updateApplication(this.id);
        } else {
            this.postApplication();
        }
    }

    updateApplication(id: number): void {
        this.applicationService
            .updateApplication(this.application, id)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.router.navigateByUrl('/mine-applikationer');
                },
                (error: HttpErrorResponse) => {
                    this.errorFields = [];
                    this.errorMessages = [];
                    error.error.message.forEach((err) => {
                        this.errorFields.push(err.property);
                        this.errorMessages = this.errorMessages.concat(
                            Object.values(err.constraints)
                        );
                    });
                    this.formFailedSubmit = true;
                }
            );
    }

    postApplication(): void {
        this.applicationService
            .createApplication(this.application)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.router.navigateByUrl('/mine-applikationer');
                },
                (error: HttpErrorResponse) => {
                    this.errorFields = [];
                    this.errorMessages = [];
                    error.error.message.forEach((err) => {
                        this.errorFields.push(err.property);
                        this.errorMessages = this.errorMessages.concat(
                            Object.values(err.constraints)
                        );
                    });
                    this.formFailedSubmit = true;
                }
            );
    }

    routeBack(): void {
        this.router.navigateByUrl('/mine-applikationer');
    }

    ngOnDestroy() {
        // prevent memory leak by unsubscribing
        if (this.applicationsSubscription) {
            this.applicationsSubscription.unsubscribe();
        }
    }
}
