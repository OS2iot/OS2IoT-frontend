import { Application } from '@applications/application.model';
import { DataTargetType } from '@shared/enums/datatarget-type';
import { OpenDataDkDataset } from './opendatadk/opendatadk-dataset.model';

export class DatatargetResponse {
    application: Application;
    id: number;
    name: string;
    timeout: number;
    type: DataTargetType;
    url: string;
    authorizationHeader: string;
    openDataDkDataset: OpenDataDkDataset;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
}
