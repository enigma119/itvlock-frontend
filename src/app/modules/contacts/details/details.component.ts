import { DatePipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { StaffRoleList } from 'app/core/user/user.types';
import { ContactsService } from 'app/modules/contacts/contacts.service';
import {
    Contact,
    Country,
    StaffUser,
} from 'app/modules/contacts/contacts.types';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        NgClass,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        FuseFindByKeyPipe,
        DatePipe,
    ],
})
export class AddStaffDialogComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;


    editMode: boolean = false;
    contact: Contact;
    contactForm: UntypedFormGroup;
    countries: Country[];
    userTypesList = StaffRoleList;

    mode: 'add' | 'edit' | 'view' = 'view';
    user: StaffUser;


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    readonly phoneLabels: { value: string; label: string }[] = [
        { value: 'Mobile', label: 'Mobile' },
        { value: 'Home', label: 'Domicile' },
        { value: 'Work', label: 'Travail' }
    ];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _formBuilder: UntypedFormBuilder,
        private _dialogRef: MatDialogRef<AddStaffDialogComponent>,
        private _dialog: MatDialog,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit' | 'view', user?: StaffUser },
    ) {
        this.mode = data.mode;
        this.user = data.user;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            fullName: ['', [Validators.required]],
            email: [''],
            address: [''],
            phoneNumbers: this._formBuilder.array([]),
            role: ['', Validators.required],
            tenantId: [''],
        });

        // Add password control only for new users (add mode)
        if (this.mode === 'edit' && !this.user) {
            this.contactForm.addControl('password', this._formBuilder.control('', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
            ]));
        }

        this.getTenantId();

        if (this.mode === 'edit' && !this.user) {
            this.addPhoneNumberField()
        }

        if (this.mode === 'edit' && this.user) {
            this.toggleEditMode()
        }

        // Get the country telephone codes
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

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

    getTenantId() {
        this._userService.user$.subscribe((res) => {
            this.contactForm.get('tenantId')?.setValue(res?.tenantId);
        })
    }


    createStaffMember(): void {
        const contact = this.contactForm.getRawValue();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Confirmation',
            message: 'Voulez-vous créer ce membre du personnel ?',
            actions: {
                confirm: {
                    label: 'Créer',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._contactsService
                    .createStaff(contact)
                    .subscribe({
                        next: (res) => {
                            Swal.fire({
                                title: 'Success',
                                text: 'Nouveau membre du personnel créé avec succès',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
                                position: 'top-end',
                            });
                            this._dialog.closeAll();
                        },
                        error: (err) => {
                            Swal.fire({
                                title: 'Error',
                                text: 'Erreur lors de la création du membre du personnel',
                                icon: 'error',
                                showConfirmButton: false,
                                timer: 1500,
                                position: 'top-end',
                            });
                            console.log(err);
                        }
                    });
            }
        });
    }

    updateStaffMember(): void {
        if (this.contactForm.invalid) {
            return;
        }
        const contact = this.contactForm.getRawValue();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Confirmation',
            message: 'Voulez-vous modifier ce membre du personnel ?',
            actions: {
                confirm: {
                    label: 'Modifier',
                },
                cancel: {
                    label: 'Annuler',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._contactsService.updateStaff(contact, this.user._id).subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'Success',
                            text: 'Membre du personnel modifié avec succès',
                            icon: 'success',
                            showConfirmButton: false,
                            position: 'top-end',
                            timer: 1500
                        });
                        this._dialog.closeAll();
                    },
                    error: (err) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Erreur lors de la modification du membre du personnel',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1500,
                            position: 'top-end',
                        });
                    }
                });
            }
        });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        // this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.contactForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.contact.avatar = null;
    }



    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void {
        // Check if we've reached the limit
        if (!this.canAddPhoneNumber()) {
            return;
        }

        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country: ['sn'],
            phoneNumber: [''],
            label: [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(
            phoneNumberFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get(
            'phoneNumbers'
        ) as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    closeDialog() {
        this._dialog.closeAll();
    }

    // Add this method to your class
    getAvailableLabels(currentIndex: number): { value: string; label: string }[] {
        const currentLabels = (this.contactForm.get('phoneNumbers') as UntypedFormArray).controls
            .map((control, index) => index !== currentIndex ? control.get('label').value : null)
            .filter(label => label !== null);

        return this.phoneLabels.filter(label => !currentLabels.includes(label.value));
    }

    // Add this method to check if we can add more phone numbers
    canAddPhoneNumber(): boolean {
        const phoneNumbersArray = this.contactForm.get('phoneNumbers') as UntypedFormArray;
        return phoneNumbersArray.length < 3;
    }

    getUserRoleLabel(roleValue: string): string {
        return this.userTypesList.find(role => role.role === roleValue)?.label;
    }

    patchPhoneNumberForm(user: StaffUser) {
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).clear();
        const phoneNumbersFormGroups = [];

        if (user.phoneNumbers.length > 0) {
            user.phoneNumbers.forEach((phoneNumber) => {
                phoneNumbersFormGroups.push(
                    this._formBuilder.group({
                        country: [phoneNumber.country],
                        phoneNumber: [phoneNumber.phoneNumber],
                        label: [phoneNumber.label],
                    })
                );
            });
        } else {
            phoneNumbersFormGroups.push(
                this._formBuilder.group({
                    country: ['sn'],
                    phoneNumber: [''],
                    label: [''],
                })
            );
        }
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (
                this.contactForm.get('phoneNumbers') as UntypedFormArray
            ).push(phoneNumbersFormGroup);
        });
    }


    toggleEditMode(): void {
        this.contactForm.patchValue(this.user);
        this.patchPhoneNumberForm(this.user);

        this.mode = 'edit';
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
