export interface SigfoxDevice {
    id: string;
    name: string;
    satelliteCapable: boolean;
    sequenceNumber: number;
    lastCom: any;
    state: number;
    comState: number;
    pac: string;
    location: Location;
    deviceType: string;
    group: string;
    lqi: number;
    activationTime: any;
    token: Token;
    contract: string;
    creationTime: any;
    modemCertificate: string;
    prototype: boolean;
    productCertificate: string;
    automaticRenewal: boolean;
    automaticRenewalStatus: number;
    lastEditionTime: any;
    lastEditedBy: string;
    activable: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    createdByName: string;
    updatedByName: string;
}

export interface Token {
    state: number;
    detailMessage: string;
    end: any;
    freeMessages?: number;
    freeMessagesSent?: number;
}

export interface SigfoxDevicesResponse {
    data: SigfoxDevice[];
}
