import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MineLoraGatewaysComponent } from './mine-lora-gateways/mine-lora-gateways.component';
import { RouterModule } from '@angular/router';
import { ListLoraGatewayComponent } from './list-lora-gateway/list-lora-gateway.component';
import { TopBarModule } from 'src/app/shared/top-bar/top-bar.module';
import { TranslateModule } from '@ngx-translate/core';
import { AdminLoraTableComponent } from './admin-lora-table/admin-lora-table.component';
import { AdminLoraTableRowComponent } from './admin-lora-table-row/admin-lora-table-row.component';


@NgModule({
  declarations: [
    MineLoraGatewaysComponent, 
    ListLoraGatewayComponent, AdminLoraTableComponent, AdminLoraTableRowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TopBarModule,
    TranslateModule
  ],
  exports: [
    MineLoraGatewaysComponent,
    ListLoraGatewayComponent
  ]
})
export class AdministrationGatewayModule { }
