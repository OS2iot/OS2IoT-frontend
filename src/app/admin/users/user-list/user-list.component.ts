import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationAccessScope } from '@shared/enums/access-scopes';
import { MeService } from '@shared/services/me.service';
import { SharedVariableService } from '@shared/shared-variable/shared-variable.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    canEdit: boolean;    
    organizationId: number;

    constructor(
        private titleService: Title,
        private translate: TranslateService,
        private meService: MeService,
        private globalService: SharedVariableService
    ) { 
        this.organizationId = this.globalService.getSelectedOrganisationId();
    }

    ngOnInit(): void {
        this.translate.get(['TITLE.USER'])
            .subscribe(translations => {
                this.titleService.setTitle(translations['TITLE.USER']);
            });
        this.canEdit = this.meService.hasAccessToTargetOrganization(OrganizationAccessScope.UserAdministrationWrite);
    }
}
