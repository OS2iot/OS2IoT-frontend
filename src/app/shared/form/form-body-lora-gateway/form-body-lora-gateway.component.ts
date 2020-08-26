import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Gateway } from '../../../../app/models/gateway'
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ChirpstackGatewayService } from '../../_services/chirpstack-gateway.service';

@Component({
  selector: 'app-form-body-lora-gateway',
  templateUrl: './form-body-lora-gateway.component.html',
  styleUrls: ['./form-body-lora-gateway.component.scss']
})
export class FormBodyLoraGatewayComponent implements OnInit {

  @Input() submitButton: string;
  public form: FormGroup;
  public payLoad = '';
  public gatewaySubscription: Subscription;
  public errorMessage: string;
  public errorMessages: any;
  public errorFields: string[];
  public formFailedSubmit: boolean = false;
  private id: string;

  gateway = new Gateway();

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private router: Router,
    private loraGatewayService: ChirpstackGatewayService
  ) { }

  ngOnInit(): void {
    this.translate.use('da');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
        this.getGateway(this.id);
    }
  }

  getGateway(id: string): void {
    this.gatewaySubscription = this.loraGatewayService
        .get()
        .subscribe((result: any) => {
          this.gateway = result.result[0]
        });
  }

  createGateway(): void {
    this.loraGatewayService.post(this.gateway)
      .subscribe(
        (response) => {
          console.log(response);
          this.router.navigateByUrl('/mine-lora-gateways')
        },
        (error: HttpErrorResponse) => {
          this.showError(error)
        }
      )
  }

  updateGateway(): void {
    this.loraGatewayService
      .put(this.gateway, this.id)
      .subscribe(
        (response) => {
          
            this.router.navigateByUrl('/mine-applikationer');
        },
        (error) => {
          this.showError(error)
        })
  }

  onSubmit(): void {
    if (this.id) {
        this.updateGateway();
    } else {
        this.createGateway();
    }
  }

  routeBack(): void {
    this.router.navigateByUrl('/mine-lora-gateways');
  }

  ngOnDestroy() {
      if (this.gatewaySubscription) {
          this.gatewaySubscription.unsubscribe();
      }
  }

  onCoordinateKey(event: any) {
    console.log(event.target.value);
    console.log(event.target.maxLength);
    if (event.target.value.length > event.target.maxLength)
        event.target.value = event.target.value.slice(
            0,
            event.target.maxLength
        );
}

  private showError(error: HttpErrorResponse) {
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
}
