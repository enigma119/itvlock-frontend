import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule, I18nPluralPipe, NgClass, PercentPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { Amenity, FetchPropertyDto, Property } from '../property.types';
import { PropertyService } from '../property.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPropertyComponent } from '../add/add.component';

@Component({
    selector: 'property-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CdkScrollable,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        NgClass,
        MatTooltipModule,
        MatProgressBarModule,
        MatButtonModule,
        RouterLink,
        FuseFindByKeyPipe,
        PercentPipe,
        I18nPluralPipe,
        MatDialogModule,
        CommonModule,
    ],
})
export class PropertyListComponent implements OnInit, OnDestroy {
    filterProperties: Property[] = [];
    filters: {
        query$: BehaviorSubject<string>;
    } = {
        query$: new BehaviorSubject(''),
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    properties: Property[] = [];
    propertiesTotal: number = 0;
    amenities: Amenity[] = [];
    isLoading: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _propertyService: PropertyService,
        private _matDialog: MatDialog,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getProperties();
        this.getAmenities();

        // Filter the properties
        combineLatest([
            this.filters.query$,
        ]).subscribe(([query]) => {
            // Reset the filtered properties
            this.filterProperties = [...this.properties];

            // Filter by search query
            if (query !== '') {
                this.filterProperties = this.filterProperties.filter(
                    (property) =>
                        property.name
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        property.address
                            .toLowerCase()
                            .includes(query.toLowerCase())
                );
            }

            this._changeDetectorRef.detectChanges();
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

    getProperties(fetchPropertyDto: FetchPropertyDto = { skip: 0, limit: 1000 }): void {
        this._propertyService.getProperties(fetchPropertyDto)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next: (response: any) => {
                this.isLoading = false;
                this.properties = response.data;
                this.filterProperties = [...response.data];
                this.propertiesTotal = response.total;
                this._changeDetectorRef.detectChanges();
            },
            error: (error: any) => {
                this.isLoading = false;
                console.error('Error fetching properties:', error);
                this._changeDetectorRef.detectChanges();
            },
        });
    }

    getAmenities(): void {
        this._propertyService.getAmenities()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response: any) => {
            this.amenities = response;
        });
    }

    openAddPropertyDialog(): void {
        this._matDialog.open(AddPropertyComponent, {
            height: '70%',
            data: {
                amenities: this.amenities,
            },
        }).afterClosed().subscribe((result) => {
            this.getProperties();
        });
    }

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
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
}
