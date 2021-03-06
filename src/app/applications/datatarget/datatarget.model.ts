import { DataTargetType } from '@shared/enums/datatarget-type';
import { OpenDataDkDataset as OpenDataDkDataset } from './opendatadk/opendatadk-dataset.model';

export class Datatarget {
    id: number;
    name: string;
    applicationId: number;
    type: DataTargetType = DataTargetType.HTTPPUSH;
    url: string;
    //default 30 sec
    timeout: number = 30000;
    authorizationHeader: string;
    setToOpendataDk = false;
    openDataDkDataset: OpenDataDkDataset = new OpenDataDkDataset();
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    createdByName: string;
    updatedByName: string;
}

export class DatatargetData {
    data: Datatarget[];
    ok?: boolean;
    count?: number;
}