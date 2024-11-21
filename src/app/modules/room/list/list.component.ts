import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FetchAllRoomDto,
    FetchAllRoomResponse,
    Item,
    Items,
    Room,
} from 'app/modules/room/room.types';
import { Subject, takeUntil } from 'rxjs';
import { RoomService } from '../room.service';
import { AddRoomComponent } from '../add/add.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'file-manager-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
    ],
})
export class RoomListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    propertyId: string;
    rooms: Room[] = [];
    total: number = 0;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _roomService: RoomService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,
    ) {
        this.propertyId = this._activatedRoute.snapshot.params['propertyId'];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.fetchAllRooms();

        // Get the items
        this._roomService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._roomService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    fetchAllRooms(fetchAllRoomDto: FetchAllRoomDto = { skip: 0, limit: 50, propertyId: this.propertyId }): void {
        this.isLoading = true;
        this._roomService.fetchAllRooms(fetchAllRoomDto)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next: (response: FetchAllRoomResponse) => {
                this.rooms = response.data;
                this.total = response.total;
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            error: (error: any) => {
                this.isLoading = false;
                console.error('Error fetching rooms:', error);
                this._changeDetectorRef.markForCheck();
            },
        });
    }

    openAddRoomDialog(): void {
        this._matDialog.open(AddRoomComponent, {
            data: { propertyId: this.propertyId },
        }).afterClosed().subscribe((result) => {
            this.fetchAllRooms();
        });
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item._id || index;
    }

    setRoom(room: Room): void {
        this._roomService.setRoom(room);
        this._router.navigate(['./details', room._id], { relativeTo: this._activatedRoute });
    }
}
