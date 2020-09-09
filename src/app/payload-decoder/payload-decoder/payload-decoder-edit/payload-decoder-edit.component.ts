import { Component, OnInit, Input } from '@angular/core';
import { PayloadDecoder } from 'src/app/payload-decoder/payload-decoder.model';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { BackButton } from 'src/app/models/back-button';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as fromApp from '../../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as PayloadDecoderActions from '../../store/payload-decoder.actions';
import { Subscription } from 'rxjs';
import { PayloadDecoderService } from 'src/app/shared/services/payload-decoder.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payload-decoder-edit',
  templateUrl: './payload-decoder-edit.component.html',
  styleUrls: ['./payload-decoder-edit.component.scss']
})
export class PayloadDecoderEditComponent implements OnInit {
  payloadDecoder = new PayloadDecoder();
  public errorMessage: string;
  public errorMessages: any;
  public errorFields: string[];
  public formFailedSubmit = false;
  public form: FormGroup;
  public backButton: BackButton = { label: '', routerLink: '/payload-decoder' };
  public title = '';
  public submitButton = '';
  id: number;
  subscription: Subscription;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private payloadDecoderService: PayloadDecoderService,
    private store: Store<fromApp.AppState>,
    private location: Location) { }

  ngOnInit(): void {
    this.translate.use('da');
    this.translate.get(['NAV.PAYLOAD-DECODER', 'FORM.EDIT-PAYLOAD-DECODER', 'PAYLOAD-DECODER.SAVE'])
      .subscribe(translations => {
        this.backButton.label = translations['NAV.PAYLOAD-DECODER'];
        this.title = translations['FORM.EDIT-PAYLOAD-DECODER'];
        this.submitButton = translations['PAYLOAD-DECODER.SAVE'];
      });
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id > 0) {
      this.getPayloadDecoder(this.id);
    }
  }

  private getPayloadDecoder(id: number) {
    this.subscription =  this.payloadDecoderService.getOne(id)
      .subscribe(
        (response) => {
        this.payloadDecoder = response;
    });
  }

  private create(): void {
    this.payloadDecoderService.post(this.payloadDecoder)
      .subscribe(
        (response) => {
          console.log(response);
          this.routeBack();
        },
        (error: HttpErrorResponse) => {
          this.showError(error);
        }
      );
  }

  private update(): void {
    this.payloadDecoderService.put(this.payloadDecoder, this.id)
      .subscribe(
        (response) => {
          this.routeBack();
        },
        (error) => {
          this.showError(error);
        });
  }

  onSubmit(): void {
    if (this.payloadDecoder.id) {
      this.update();
    } else {
      this.create();
    }
  }

  private showError(error: HttpErrorResponse) {
    this.errorFields = [];
    this.errorMessages = [];
    if (error.error?.message?.length > 0) {
      error.error.message[0].children.forEach((err) => {
        this.errorFields.push(err.property);
        this.errorMessages = this.errorMessages.concat(
          Object.values(err.constraints)
        );
      });
    } else {
      this.errorMessage = error.message;
    }
    this.formFailedSubmit = true;
  }

  /* fetchData() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('payloadDecoders');
        }),
        map(payloadDecodersState => {
          return payloadDecodersState.payloadDecoders.find((payloadDecoder) => {
            return payloadDecoder.id === this.id;
          });
        })
      )
      .subscribe(payloadDecoder => {
        if (payloadDecoder) {
          this.payloadDecoder = payloadDecoder;
        }
      });
  } */

/*   onSubmit() {
    if (this.id) {
      this.store.dispatch(
        new PayloadDecoderActions.UpdatePayloadDecoder({
          id: this.id,
          payloadDecoder: this.payloadDecoder
        })
      );
    } else {
      this.store.dispatch(new PayloadDecoderActions.AddPayloadDecoder(this.payloadDecoder));
    }
    this.routeBack();
  } */

  routeBack(): void {
    this.location.back();
  }

}