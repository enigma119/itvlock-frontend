import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import { FetchStaffParams } from '../contacts/contacts.types';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    checkIn(data: any) {
        return this._httpClient.post(`${environment.apiUrl}/api/guests/check-in`, data);
    }

    checkOut(data: any) {
        return this._httpClient.post(`${environment.apiUrl}/api/guests/check-out`, data);
    }

    fetchGuest(params: any) {
        return this._httpClient.get(`${environment.apiUrl}/api/guests`, { params });
    }

}
