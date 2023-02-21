import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from '@applications/application.model';
import { TranslateService } from '@ngx-translate/core';
import { DeleteDialogComponent } from '@shared/components/delete-dialog/delete-dialog.component';
import { DeleteDialogService } from '@shared/components/delete-dialog/delete-dialog.service';
import { DeviceType } from '@shared/enums/device-type';
import { BackButton } from '@shared/models/back-button.model';
import { Subscription } from 'rxjs';
import { Downlink } from '../downlink.model';
import { IotDevice } from '../iot-device.model';
import { IoTDeviceService } from '../iot-device.service';
import {
  DropdownButton,
  ExtraDropdownOption,
} from '@shared/models/dropdown-button.model';
import { Title } from '@angular/platform-browser';
import { MeService } from '@shared/services/me.service';
import { OrganizationAccessScope } from '@shared/enums/access-scopes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ChartConfiguration } from 'chart.js';
import moment from 'moment';
import { recordToEntries } from '@shared/helpers/record.helper';
import { ColorGraphBlue1 } from '@shared/constants/color-constants';

/**
 * Ordered from "worst" to "best" (from DR0 and up)
 */
const dataRateColors = [
  '#F57A2F',
  '#FFA620',
  '#F6CE06',
  '#FFEB3B',
  '#CDDC39',
  '#93E528',
  '#72D144',
  '#56B257',
];

@Component({
  selector: 'app-iot-device',
  templateUrl: './iot-device-detail.component.html',
  styleUrls: ['./iot-device-detail.component.scss'],
})
export class IoTDeviceDetailComponent implements OnInit, OnDestroy {
  device: IotDevice;
  public deviceId: number;
  public backButton: BackButton = { label: '', routerLink: undefined };
  public application: Application;
  public latitude: number;
  public longitude: number;
  public iotDeviceSubscription: Subscription;
  public deviceProfileSubscription: Subscription;
  public OTAA = true;
  public detailsText: string;
  public downlinkText: string;
  public deviceProfileName: string;
  public serviceProfileName: string;
  public downlink = new Downlink();
  public errorMessages: string[];
  private deleteDialogSubscription: Subscription;
  public dropdownButton: DropdownButton;
  public canEdit = false;

  private resetApiKeyId = 'RESET-API-KEY';
  private resetApiKeyOption: ExtraDropdownOption;
  private resetApiKeyBody: string;
  private resetApiKeyConfirm: string;
  private resetApiKeyCancel: string;

  public genericHttpDeviceUrl: string;
  private hasFetchedDeviceStats = false;
  dataRateChartData: ChartConfiguration['data'] = { datasets: [] };
  rssiChartData: ChartConfiguration['data'] = { datasets: [] };
  snrChartData: ChartConfiguration['data'] = { datasets: [] };

  dataRateChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        position: 'average',
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private iotDeviceService: IoTDeviceService,
    private translate: TranslateService,
    private router: Router,
    private deleteDialogService: DeleteDialogService,
    private dialog: MatDialog,
    private titleService: Title,
    private meService: MeService
  ) {}

  ngOnInit(): void {
    this.deviceId = +this.route.snapshot.paramMap.get('deviceId');
    const appId: number = +this.route.snapshot.paramMap.get('id');
    this.canEdit = this.meService.hasAccessToTargetOrganization(
      OrganizationAccessScope.ApplicationWrite,
      undefined,
      appId
    );

    if (this.deviceId) {
      this.bindIoTDeviceAndApplication(this.deviceId);
      this.dropdownButton = {
        label: '',
        editRouterLink: '../../iot-device-edit/' + this.deviceId,
        isErasable: true,
      };
    }

    this.translate
      .get([
        'NAV.APPLICATIONS',
        'IOTDEVICE-TABLE-ROW.SHOW-OPTIONS',
        'TITLE.IOTDEVICE',
        'IOTDEVICE-TABLE-ROW.RESET-API-KEY',
        'IOTDEVICE.GENERIC_HTTP.RESET-API-KEY',
        'GEN.CANCEL',
      ])
      .subscribe((translations) => {
        this.backButton.label = translations['NAV.APPLICATIONS'];
        this.dropdownButton.label =
          translations['IOTDEVICE-TABLE-ROW.SHOW-OPTIONS'];
        this.titleService.setTitle(translations['TITLE.IOTDEVICE']);

        this.resetApiKeyOption = {
          id: this.resetApiKeyId,
          label: translations['IOTDEVICE-TABLE-ROW.RESET-API-KEY'],
        };
        this.resetApiKeyBody =
          translations['IOTDEVICE.GENERIC_HTTP.RESET-API-KEY']['BODY'];
        this.resetApiKeyConfirm =
          translations['IOTDEVICE.GENERIC_HTTP.RESET-API-KEY']['YESRESET'];
        this.resetApiKeyCancel = translations['GEN.CANCEL'];
      });

    this.dropdownButton.extraOptions = [];
  }

  bindIoTDeviceAndApplication(deviceId: number) {
    this.iotDeviceSubscription = this.iotDeviceService
      .getIoTDevice(deviceId)
      .subscribe((device: IotDevice) => {
        this.device = device;
        this.application = device.application;
        if (this.device.location) {
          this.longitude = this.device.location.coordinates[0];
          this.latitude = this.device.location.coordinates[1];
        }

        if (this.canEdit && this.device.type === DeviceType.GENERIC_HTTP) {
          this.dropdownButton.extraOptions.push(this.resetApiKeyOption);
        }
      });
  }

  showSigfoxDeleteDialog() {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      data: {
        message:
          'Sigfox enheder kan ikke slettes fra OS2IoT, de skal slettes fra backend.sigfox.com, hvorefter de automatisk bliver slettet fra OS2IoT inden for få minutter',
        showAccept: false,
        showCancel: true,
      },
    });
  }

  routeToApplication(): void {
    this.router.navigate(['applications', this.application.id]);
  }

  clickDelete() {
    if (this.device.type === DeviceType.SIGFOX) {
      this.showSigfoxDeleteDialog();
    } else {
      this.deleteDialogSubscription = this.deleteDialogService
        .showSimpleDialog()
        .subscribe((response) => {
          if (response) {
            this.iotDeviceService
              .deleteIoTDevice(this.device.id)
              .subscribe((response) => {
                this.routeToApplication();
              });
          } else {
            console.log(response);
          }
        });
    }
  }

  selectedTabChange({ index }: MatTabChangeEvent): void {
    if (!this.hasFetchedDeviceStats && index === 1) {
      this.getDeviceStats();
      this.hasFetchedDeviceStats = true;
    }
  }

  private getDeviceStats(): void {
    if (
      this.device?.type !== DeviceType.LORAWAN &&
      this.device?.type !== DeviceType.SIGFOX
    ) {
      return;
    }

    this.iotDeviceService.getDeviceStats(this.deviceId).subscribe(
      (response) => {
        if (!response) {
          return;
        }

        const {
          rssiDatasets,
          snrDatasets,
          dataRateDatasets,
          labels,
        } = response.reduce(
          (
            res: {
              rssiDatasets: ChartConfiguration['data']['datasets'];
              snrDatasets: ChartConfiguration['data']['datasets'];
              dataRateDatasets: ChartConfiguration['data']['datasets'];
              labels: ChartConfiguration['data']['labels'];
            },
            data
          ) => {
            // Hide zero-values with null
            res.rssiDatasets[0].data.push(data.rssi || null);
            res.snrDatasets[0].data.push(data.snr || null);
            this.addDataRate(res.dataRateDatasets, data.rxPacketsPerDr);

            res.labels.push(moment(data.timestamp).format('MMM D'));
            return res;
          },
          {
            rssiDatasets: [
              {
                data: [],
                borderColor: ColorGraphBlue1,
                backgroundColor: ColorGraphBlue1,
              },
            ],
            snrDatasets: [
              {
                data: [],
                borderColor: ColorGraphBlue1,
                backgroundColor: ColorGraphBlue1,
              },
            ],
            dataRateDatasets: this.initDataRates(),
            labels: [],
          }
        );

        // Cleanup before saving
        this.removeEmptyDatasets(dataRateDatasets);

        this.rssiChartData = { datasets: rssiDatasets, labels };
        this.snrChartData = { datasets: snrDatasets, labels };
        this.dataRateChartData = { datasets: dataRateDatasets, labels };
      },
      (_error) => {}
    );
  }

  private initDataRates(): ChartConfiguration['data']['datasets'] {
    return dataRateColors.map((color, i) => ({
      data: [],
      label: i.toString(),
      borderColor: color,
      backgroundColor: color,
    }));
  }

  private addDataRate(
    datasets: ChartConfiguration['data']['datasets'],
    dataRate: Record<number, number> | undefined
  ) {
    if (!dataRate) {
      return;
    }

    const dataRateList = recordToEntries(dataRate, false);
    datasets.forEach((dataset) => {
      if (!dataRateList.length) {
        dataset.data.push(0);
        return;
      }

      const match = dataRateList.find(
        (record) => record.key.toString() === dataset.label
      );
      match ? dataset.data.push(match.value) : dataset.data.push(0);
    });
  }

  private removeEmptyDatasets(
    datasets: ChartConfiguration['data']['datasets']
  ): void {
    for (let i = datasets.length - 1; i >= 0; i--) {
      const dataset = datasets[i];
      if (!dataset.data.some((point) => point !== 0)) {
        datasets.splice(i, 1);
      }
    }
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    if (this.iotDeviceSubscription) {
      this.iotDeviceSubscription.unsubscribe();
    }
    if (this.deleteDialogSubscription) {
      this.deleteDialogSubscription.unsubscribe();
    }
  }

  clickExtraDropdownOption(id: string) {
    if (id === this.resetApiKeyId) {
      this.deleteDialogService
        .showSimpleDialog(
          this.resetApiKeyBody,
          true,
          true,
          false,
          '',
          false,
          this.resetApiKeyConfirm,
          this.resetApiKeyCancel
        )
        .subscribe((isConfirmed) => {
          if (isConfirmed) {
            this.iotDeviceService
              .resetHttpDeviceApiKey(this.device.id)
              .subscribe((response) => {
                this.device = {
                  ...this.device,
                  apiKey: response.apiKey,
                };
              });
          }
        });
    }
  }
}
