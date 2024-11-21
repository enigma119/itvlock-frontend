import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    tap,
} from 'rxjs';
import { FetchPropertyResponse, FetchPropertyDto, Property, Amenity } from './property.types';
import { environment } from 'app/environments/environment';

@Injectable({ providedIn: 'root' })
export class PropertyService {
    private properties$$ = new BehaviorSubject<Property[] | null>(null);
    public properties$ = this.properties$$.asObservable();

    private propertiesResponse$$ = new BehaviorSubject<FetchPropertyResponse | null>(null);
    public propertiesResponse$ = this.propertiesResponse$$.asObservable();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    getProperties(fetchPropertyDto: FetchPropertyDto): Observable<FetchPropertyResponse> {
        return this._httpClient.get<FetchPropertyResponse>(`${environment.apiUrl}/api/properties`, { params: new HttpParams({ fromObject: fetchPropertyDto as any }) }).pipe(
            tap((response: any) => {
                this.propertiesResponse$$.next(response);
            })
        );
    }

    getPropertyById(id: string): Observable<Property> {
        return this._httpClient.get<Property>(`${environment.apiUrl}/api/properties/${id}`);
    }

    createProperty(property: Property): Observable<Property> {
        return this._httpClient.post<Property>(`${environment.apiUrl}/api/properties`, property);
    }

    updateProperty(id: string, property: Property): Observable<Property> {
        return this._httpClient.patch<Property>(`${environment.apiUrl}/api/properties/${id}`, property);
    }

    deleteProperty(id: string): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiUrl}/api/properties/${id}`);
    }

    getAmenities(): Observable<Amenity[]> {
        return this._httpClient.get<Amenity[]>(`${environment.apiUrl}/api/amenities`);
    }
}
