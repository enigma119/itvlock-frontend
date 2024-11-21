import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { environment } from 'app/environments/environment';
import {
    ChangeStaffPasswordParams,
    Contact,
    Country,
    FetchStaffParams,
    FetchStaffResponse,
    StaffUser,
    UpdateStaffRoleParams,
} from 'app/modules/contacts/contacts.types';
import {
    BehaviorSubject,
    Observable,
    tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactsService {
    // Private
    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject(
        null
    );
    private _contacts: BehaviorSubject<Contact[] | null> = new BehaviorSubject(
        null
    );
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(
        null
    );
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact> {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    fetchStaff(params: FetchStaffParams): Observable<FetchStaffResponse> {
        return this._httpClient.get<FetchStaffResponse>(`${environment.apiUrl}/api/users`, { params: new HttpParams({ fromObject: params as any }) });
    }

    createStaff(user: User): Observable<StaffUser> {
        return this._httpClient.post<StaffUser>(`${environment.apiUrl}/api/users/create-staff-member`, user);
    }

    updateStaff(user: StaffUser, userId: string): Observable<StaffUser> {
        return this._httpClient.patch<StaffUser>(`${environment.apiUrl}/api/users/update-staff-member/${userId}`, user);
    }

    changeStaffPassword(changeStaffPassword: ChangeStaffPasswordParams): Observable<StaffUser> {
        return this._httpClient.patch<StaffUser>(`${environment.apiUrl}/api/users/change-staff-password`, changeStaffPassword);
    }

    updateStaffRole(updateStaffRole: UpdateStaffRoleParams): Observable<StaffUser> {
        return this._httpClient.patch<StaffUser>(`${environment.apiUrl}/api/users/update-staff-role`, updateStaffRole);
    }

    deleteStaff(userId: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`${environment.apiUrl}/api/users/delete-staff-member/${userId}`);
    }

    getCountries(): Observable<Country[]> {
        return this._httpClient
            .get<Country[]>('api/apps/contacts/countries')
            .pipe(
                tap((countries) => {
                    this._countries.next(countries);
                })
            );
    }
}
