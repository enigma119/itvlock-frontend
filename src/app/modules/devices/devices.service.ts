import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeviceDetails, SmartDevice } from './devices.type';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

    private device$$ = new BehaviorSubject<any | null>(null);
    public device$ = this.device$$.asObservable();

  constructor(private http: HttpClient) { }

  getDevices(tenantId: string) {
    return this.http.get(`${environment.apiUrl}/api/external-api/devices/${tenantId}`);
  }

  setDevice(device: SmartDevice): void {
    this.device$$.next(device);
  }

  getDeviceDetails(lockId: number, tenantId: string) {
    return this.http.get(`${environment.apiUrl}/api/external-api/device-details/${lockId}/${tenantId}`);
  }

}
