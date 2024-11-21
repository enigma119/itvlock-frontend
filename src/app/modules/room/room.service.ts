import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'app/environments/environment';
import {
    CreateRoomDto,
    FetchAllRoomDto,
    FetchAllRoomResponse,
    Item,
    Items,
    Room,
    UpdateRoomDto,
} from 'app/modules/room/room.types';
import {
    BehaviorSubject,
    Observable,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomService {
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);

    private room$$: BehaviorSubject<Room | null> = new BehaviorSubject(null);
    public room$ = this.room$$.asObservable();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for items
     */
    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Get items
     */
    getItems(folderId: string | null = null): Observable<Item[]> {
        return this._httpClient
            .get<Items>('api/apps/file-manager', { params: { folderId } })
            .pipe(
                tap((response: any) => {
                    this._items.next(response);
                })
            );
    }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find within the folders and files
                const item =
                    [...items.folders, ...items.files].find(
                        (value) => value.id === id
                    ) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    return throwError(
                        'Could not found the item with id of ' + id + '!'
                    );
                }

                return of(item);
            })
        );
    }



    createRoom(room: CreateRoomDto): Observable<Room> {
        return this._httpClient.post<Room>(`${environment.apiUrl}/api/rooms`, room);
    }

    fetchAllRooms(fetchAllRoomDto: FetchAllRoomDto): Observable<FetchAllRoomResponse> {
        return this._httpClient.get<FetchAllRoomResponse>(`${environment.apiUrl}/api/rooms`, { params: new HttpParams({ fromObject: fetchAllRoomDto as any }) });
    }

    getRoomById(id: string): Observable<Room> {
        return this._httpClient.get<Room>(`${environment.apiUrl}/api/rooms/${id}`);
    }

    updateRoom(id: string, room: UpdateRoomDto): Observable<Room> {
        return this._httpClient.patch<Room>(`${environment.apiUrl}/api/rooms/${id}`, room);
    }

    deleteRoom(id: string): Observable<any> {
        return this._httpClient.delete<any>(`${environment.apiUrl}/api/rooms/${id}`);
    }

    setRoom(room: Room): void {
        this.room$$.next(room);
    }
}
