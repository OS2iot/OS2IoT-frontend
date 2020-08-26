import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { MineApplikationerComponent } from './views/mine-applikationer/mine-applikationer/mine-applikationer.component';
import { EditApplicationComponent } from './views/mine-applikationer/edit-application/edit-application.component';
import { ListApplicationsComponent } from './views/mine-applikationer/list-applications/list-applications.component';
import { ApplicationComponent } from './views/mine-applikationer/application/application.component';
import { MineLoraGatewaysComponent } from './views/administration-gateway/mine-lora-gateways/mine-lora-gateways.component';
import { ListLoraGatewayComponent } from './views/administration-gateway/list-lora-gateway/list-lora-gateway.component';
import { AlleIotEnhederComponent } from './views/alle-iot-enheder/alle-iot-enheder/alle-iot-enheder.component';
import { ListIotDevicesComponent } from './views/alle-iot-enheder/list-iot-devices/list-iot-devices.component';
import { CreateIotDevicesComponent } from './views/alle-iot-enheder/create-iot-devices/create-iot-devices.component';
import { EditGatewayComponent } from './views/administration-gateway/edit-gateway/edit-gateway.component';
import { GatewayComponent } from './views/administration-gateway/gateway/gateway.component';

const routes: Routes = [
    { path: 'home', component: DashboardComponent },
    { path: 'mine-applikationer', component: MineApplikationerComponent,
    children: [
        {path: '', component: ListApplicationsComponent},
        {path: 'application/:id', component: ApplicationComponent},
        {path: 'create-application', component: CreateApplicationComponent},
        {path: 'edit-application/:id', component: EditApplicationComponent},
      ] },
    { path: 'alle-iot-enheder', component: AlleIotEnhederComponent,
    children: [
        {path: '', component: ListIotDevicesComponent},
        {path: 'create-iot-device', component: CreateIotDevicesComponent},
        // {path: 'edit-application/:id', component: },
      ] },
    { path: 'mine-lora-gateways', component: MineLoraGatewaysComponent,
    children: [
        { path: '', component: ListLoraGatewayComponent},
        { path: 'edit-gateway/:id', component: EditGatewayComponent},
        { path: 'edit-gateway', component: EditGatewayComponent},
        { path: 'gateway/:id', component: GatewayComponent}
    ]},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
