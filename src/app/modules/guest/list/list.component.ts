import { DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StaffRoleList, UserRole } from 'app/core/user/user.types';
import { ContactsService } from 'app/modules/contacts/contacts.service';
import { Contact, FetchStaffParams, StaffUser } from 'app/modules/contacts/contacts.types';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import Swal from 'sweetalert2';
import { CheckInService } from '../check-in.service';

@Component({
    selector: 'guest-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        DatePipe,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule
    ],
})
export class GuestListComponent implements OnInit, OnDestroy {
    staffTableColumns: string[] = ['fullName', 'email', 'phoneNumber', 'roomName', 'roomNumber', 'checkInDate', 'checkOutDate',];;
    drawerMode: 'side' | 'over';
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    fetchedGuests: any[] = [];

    userTypesList = StaffRoleList;
    fetchedUsers: StaffUser[] = [];
    usersCount: number = 0;
    filterForm: UntypedFormGroup;
    dataSource: MatTableDataSource<StaffUser> = new MatTableDataSource<StaffUser>([]);

    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25, 100];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _checkInService: CheckInService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _dialog: MatDialog,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.filterForm = this._formBuilder.group({
            searchValue: [''],
        });

        // Add subscription to searchValue changes
        this.filterForm.get('searchValue').valueChanges.pipe(
            debounceTime(300), // Wait for 300ms pause in typing
            distinctUntilChanged(), // Only emit if value is different from previous
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            this.fetchGuest(this.filterForm.value);
        });

        this.fetchGuest(this.filterForm.value);
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


    fetchGuest(params: FetchStaffParams): void {
        // Serialize params, excluding empty searchValue
        const serializedParams = {
            ...(params.searchValue?.trim() && { searchValue: params.searchValue.trim() }),
            skip: this.pageIndex * this.pageSize,
            limit: this.pageSize,
        };

        this._checkInService.fetchGuest(serializedParams).subscribe({
            next: (guest: any) => {
                this.fetchedGuests = guest;
                // this.fetchedUsers = users.data;
                // this.usersCount = users.total;
                this.dataSource = new MatTableDataSource<any>(this.fetchedGuests);
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    onPageChange(event: any): void {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.fetchGuest(this.filterForm.value);
    }


    doFilter(): void {
        this.fetchGuest(this.filterForm.value);
    }

    // openDetails(user: StaffUser): void {
    //     this._dialog.open(AddStaffDialogComponent, {
    //         height: '80vh',
    //         data: {
    //             mode: 'view',
    //             user,
    //         },
    //     }).afterClosed().subscribe(() => {
    //         this.fetchGuest(this.filterForm.value);
    //     });
    // }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    resetFilterForm(): void {
        this.filterForm.reset();
        this.fetchGuest(this.filterForm.value);
    }


}
