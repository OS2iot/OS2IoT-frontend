import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { NavbarComponent } from '@app/navbar/navbar.component';
import { Application } from '@applications/application.model';
import { ApplicationService } from '@applications/application.service';
import { TranslateService } from '@ngx-translate/core';
import { Sort } from '@shared/models/sort.model';
import { SharedVariableService } from '@shared/shared-variable/shared-variable.service';
import { Subscription } from 'rxjs';


@Component({
  providers: [NavbarComponent],
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss'],
})
export class ApplicationsListComponent implements OnInit, OnChanges, OnDestroy {
  public pageLimit: number = 10;
  public sort: Sort[] = [
    {
      id: 1,
      dir: 'ASC',
      col: 'updatedAt',
      label: 'SORT.UPDATED-ASCENDING',
    },
    {
      id: 2,
      dir: 'DESC',
      col: 'updatedAt',
      label: 'SORT.UPDATED-DESCENDING',
    },
    {
      id: 3,
      dir: 'ASC',
      col: 'createdAt',
      label: 'SORT.CREATED-ASCENDING',
    },
    {
      id: 4,
      dir: 'DESC',
      col: 'createdAt',
      label: 'SORT.CREATED-DESCENDING',
    },
    {
      id: 5,
      dir: 'ASC',
      col: 'name',
      label: 'SORT.NAME-ASCENDING',
    },
    {
      id: 6,
      dir: 'DESC',
      col: 'name',
      label: 'SORT.NAME-DESCENDING',
    },
  ];
  public selectedSortId: number = 1;
  public selectedSortObject: Sort = {
    id: 6,
    dir: 'DESC',
    col: 'name',
    label: 'SORT.NAME-DESCENDING',
  };

  public pageTotal: number;
  public pageOffset = 0;
  public applications: Application[];
  private applicationsSubscription: Subscription;

  constructor(
    public translate: TranslateService,
    private applicationService: ApplicationService,
    private globalService: SharedVariableService
  ) {
    translate.use('da');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getApplications();
  }

  ngOnInit(): void {
    this.getApplications();
    this.globalService.getValue().subscribe((organisationId) => {
      this.getApplications(organisationId);
    });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    if (this.applicationsSubscription) {
      this.applicationsSubscription.unsubscribe();
    }
  }

  updatePageLimit(limit: any) {
    console.log(limit);
  }

  changeSort(sortId: number) {
    for (let i = 0; i < this.sort.length; i++) {
      const elem = this.sort[i];
      if (elem.id === sortId) {
        this.selectedSortObject = elem;
      }
    }
  }

  prevPage() {
    if (this.pageOffset) {
      this.pageOffset--;
    }
    this.getApplications();
  }

  nextPage() {
    if (this.pageOffset < this.pageTotal) {
      this.pageOffset++;
    }
    this.getApplications();
  }

  deleteApplication(id: number) {
    this.applicationService.deleteApplication(id).subscribe((response) => {
      if (response.ok && response.body.affected > 0) {
        this.getApplications();
      }
    });
  }

  getCurrentOrganisationId(): number {
    return this.globalService.getSelectedOrganisationId();
  }

  getApplications(orgId?: number): void {
    this.applicationsSubscription = this.applicationService
      .getApplications(
        this.pageLimit,
        this.pageOffset * this.pageLimit,
        this.selectedSortObject.dir,
        this.selectedSortObject.col,
        orgId ? orgId : this.getCurrentOrganisationId()
      )
      .subscribe((applications) => {
        this.applications = applications.data;
        if (this.pageLimit) {
          this.pageTotal = Math.ceil(applications.count / this.pageLimit);
        }
      });
  }
}