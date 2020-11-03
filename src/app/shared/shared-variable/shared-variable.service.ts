import { Injectable } from '@angular/core';
import { PermissionType } from '@app/admin/permission/permission.model';
import { AuthService, CurrentUserInfoResponse } from '@auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedVariableService {
  constructor(
    private authService: AuthService
  ) {
    this.routerInfo = new BehaviorSubject<number>(0);
  }

  private selectedOrganisationId: number;
  private gotWritePermission = false;
  private routerInfo: BehaviorSubject<number>;

  getValue(): Observable<number> {
    return this.routerInfo.asObservable();
  }

  setValue(newValue: number): void {
    this.setSelectedOrganisationId(newValue);
    this.routerInfo.next(newValue);
  }

  setSelectedOrganisationId(value: number) {
    localStorage.setItem('selected_organisation', value.toString());
    this.selectedOrganisationId = value;
    this.setHasWritePermission();
  }

  setHasWritePermission() {
    this.authService.me()
      .subscribe( (response: CurrentUserInfoResponse) => {
        const hasWritePermissions = response.user.permissions.some(
          permission =>
          permission.type === PermissionType.GlobalAdmin ||
          (permission.organization?.id === +this.selectedOrganisationId &&
            ( permission.type === PermissionType.OrganizationAdmin ||
              permission.type === PermissionType.Write)
            ));
        this.gotWritePermission = hasWritePermissions;
        localStorage.setItem('has_write_permission', hasWritePermissions.toString());
      });
  }

  getHasWritePermission(): boolean {
    if (this.gotWritePermission != null) {
      return this.gotWritePermission;
    }
    return Boolean(localStorage.getItem('has_write_permission'));
  }

  getSelectedOrganisationId() {
    if (this.selectedOrganisationId != null) {
      return this.selectedOrganisationId;
    }

    return +localStorage.getItem('selected_organisation');
  }
}
