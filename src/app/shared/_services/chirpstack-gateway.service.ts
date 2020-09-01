import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs';
import { GatewayData, Gateway, GatewayRequest, GatewayResponse } from 'src/app/models/gateway';

@Injectable({
  providedIn: 'root'
})
export class ChirpstackGatewayService {

  private chripstackGatewayUrl: string = 'chirpstack/gateway'

  constructor(private restService: RestService) { }

  public get(id: string, params = {}): Observable<GatewayResponse> {
    return  this.restService.get(this.chripstackGatewayUrl, params, id);
  }

  public getMultiple(params = {}): Observable<any> {
    return this.restService.get(this.chripstackGatewayUrl, params);
  }

  public post(gateway: Gateway): Observable<GatewayData> {
    var gatewayRequest: GatewayRequest = new GatewayRequest;
    gatewayRequest.gateway = gateway
    return this.restService.post(this.chripstackGatewayUrl, gatewayRequest, {observe: 'response'});
  }

  public put(gateway: Gateway, id: string): Observable<GatewayResponse> {
    var gatewayRequest: GatewayRequest = new GatewayRequest;
    gatewayRequest.gateway = gateway
    return this.restService.replace(this.chripstackGatewayUrl, gatewayRequest, id)
  }

  public delete(id: string): Observable<any> {
    return this.restService.delete(this.chripstackGatewayUrl, id);
  }
}
