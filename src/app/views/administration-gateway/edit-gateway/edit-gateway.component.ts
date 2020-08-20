import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackButton } from 'src/app/models/back-button';

@Component({
  selector: 'app-edit-gateway',
  templateUrl: './edit-gateway.component.html',
  styleUrls: ['./edit-gateway.component.scss']
})
export class EditGatewayComponent implements OnInit {

  public backButton: BackButton = {label: '', routerLink: '/mine-lora-gateways'};
  public multiPage: boolean = false;
  public title: string = '';
  public sectionTitle: string = '';
  public submitButton: string = '';

  constructor(
    public translate: TranslateService
    ) {
    translate.use('da');
  }

  ngOnInit(): void {
    this.translate.get(['MINE-LORA-GATEWAYS', 'FORM.EDIT-NEW-GATEWAY', 'APPLICATION.SAVE'])
    .subscribe(translations => {
      this.backButton.label = translations['MINE-LORA-GATEWAYS'];
      this.title = translations['FORM.EDIT-NEW-GATEWAY'];
      this.submitButton = translations['APPLICATION.SAVE'];
    });
  }

}
