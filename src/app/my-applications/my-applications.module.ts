import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { TopBarModule } from '../shared/top-bar/top-bar.module';
import { FormModule } from '../shared/form/form.module';

import { MyApplicationsComponent } from './my-applications.component';
import { ApplicationComponent } from './application/application.component';
import { ApplicationsTableComponent } from './applications-table/applications-table.component';
import { ApplicationsTableRowComponent } from './applications-table/applications-table-row/applications-table-row.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { ListApplicationsComponent } from './list-applications/list-applications.component';
import { AlleIotEnhederModule } from '../views/alle-iot-enheder/alle-iot-enheder.module';

@NgModule({
    declarations: [
        MyApplicationsComponent,
        ApplicationComponent,
        ApplicationsTableComponent,
        ApplicationsTableRowComponent,
        EditApplicationComponent,
        ListApplicationsComponent,
    ],
    exports: [
        MyApplicationsComponent,
        ApplicationComponent,
        ApplicationsTableComponent,
        ApplicationsTableRowComponent,
    ],
    imports: [
        CommonModule,
        TopBarModule,
        RouterModule,
        TranslateModule,
        FormModule,
        AlleIotEnhederModule
    ]
})
export class MineApplikationerModule { }