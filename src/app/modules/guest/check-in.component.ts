// room-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Room } from '../room/room.types';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { Country } from '../contacts/contacts.types';
import { takeUntil } from 'rxjs/operators';
import { ContactsService } from '../contacts/contacts.service';
import { Subject } from 'rxjs';
import { CheckInService } from './check-in.service';
import Swal from 'sweetalert2';
import { FuseConfirmationService } from '@fuse/services/confirmation';

// Add custom date format to show time
const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY HH:mm',
    },
    display: {
        dateInput: 'DD/MM/YYYY HH:mm',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-check-in-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatOptionModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgClass
    ],
    template: `
    <div class="w-[500px]">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex gap-3 items-center">
          <h2 class="text-xl font-normal">{{ room.roomName }} </h2>
          <span class="text-sm text-secondary">№ {{ room.roomNumber }}</span>
        </div>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <form [formGroup]="roomForm" class="mt-3 space-y-2">
          <!-- Guest -->
          <mat-form-field class="w-full">
            <mat-label>Nom complet</mat-label>
            <input matInput formControlName="fullName">
          </mat-form-field>

          <!-- Email -->
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" [placeholder]="'Email'" />
          </mat-form-field>

          <!-- Phone -->
          <mat-form-field class="w-full">
            <mat-label>Numéro de téléphone</mat-label>
            <input matInput [formControl]="roomForm.get('phoneNumber').get('phoneNumber')" [placeholder]="'Téléphone'" />
            <mat-select class="mr-1.5" [formControl]="roomForm.get('phoneNumber').get('country')" matPrefix>
                <mat-select-trigger>
                    <span class="flex items-center">
                        <span class="mr-1 hidden h-4 w-6 overflow-hidden sm:flex"
                            [style.background]="'url(/images/apps/contacts/flags.png) no-repeat 0 0'"
                            [style.backgroundSize]="'24px 3876px'"
                            [style.backgroundPosition]="getCountryByIso(roomForm.get('phoneNumber').get('country').value)?.flagImagePos">
                        </span>
                        <span class="text-default font-medium sm:mx-0.5">
                            {{getCountryByIso(roomForm.get('phoneNumber').get('country').value)?.code}}
                        </span>
                    </span>
                </mat-select-trigger>
                @for (country of countries; track country.iso) {
                    <mat-option [value]="country.iso">
                        <span class="flex items-center">
                            <span class="h-4 w-6 overflow-hidden"
                                [style.background]="'url(/images/apps/contacts/flags.png) no-repeat 0 0'"
                                [style.backgroundSize]="'24px 3876px'"
                                [style.backgroundPosition]="country.flagImagePos">
                            </span>
                            <span class="ml-2">{{country.name}}</span>
                            <span class="ml-2 font-medium">{{country.code}}</span>
                        </span>
                    </mat-option>
                }
            </mat-select>
          </mat-form-field>

          <!-- Check-in/Check-out -->
          <div class="flex gap-4">
            <mat-form-field class="w-full">
              <mat-label>Date et heure d'arrivée</mat-label>
              <input matInput [matDatepicker]="checkinPicker" formControlName="checkInDate"
                     [min]="minDate" (dateChange)="onCheckInChange()">
              <mat-datepicker-toggle matIconSuffix [for]="checkinPicker"></mat-datepicker-toggle>
              <mat-datepicker #checkinPicker></mat-datepicker>
              <mat-error *ngIf="roomForm.get('checkIn')?.hasError('required')">
                Date d'arrivée est requise
              </mat-error>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Date et heure de sortie</mat-label>
              <input matInput [matDatepicker]="checkoutPicker" formControlName="checkOutDate"
                     [min]="minDate" [max]="maxDate">
              <mat-datepicker-toggle matSuffix [for]="checkoutPicker"></mat-datepicker-toggle>
              <mat-datepicker #checkoutPicker></mat-datepicker>
              <mat-error *ngIf="roomForm.get('checkOut')?.hasError('required')">
                Date de sortie est requise
              </mat-error>
              <mat-error *ngIf="roomForm.get('checkOut')?.hasError('checkOutDate')">
                La date de sortie doit être après la date d'arrivée
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Room Type -->
          <mat-form-field class="w-full">
            <mat-label>Méthode d'ouverture de la chambre</mat-label>
            <mat-select formControlName="unlockMethod" multiple>
              <mat-option value="code">Code</mat-option>
              <mat-option value="card">Carte</mat-option>
              <mat-option value="guess_app">Application</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 p-4 border-t">
        <button mat-stroked-button (click)="onClose()">Annuler</button>
        <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="!roomForm.valid">
          Enregistrer
        </button>
      </div>
    </div>
  `,
})
export class CheckInDialogComponent {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    roomForm: FormGroup;
    room: Room;
    minCheckOutDate: Date | null = null;
    countries: Country[];


    minDate = new Date();
    maxDate = new Date(new Date().setDate(this.minDate.getDate() + 30));

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CheckInDialogComponent>,
        private _checkInService: CheckInService,
        private _contactsService: ContactsService,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: { room: Room }
    ) {
        this.room = data.room;
        console.log(this.room);
        this.getCountries();

        this.roomForm = this.fb.group({
            checkInDate: ['', Validators.required],
            checkOutDate: ['', [Validators.required, this.checkOutDateValidator()]],
            email: [{ value: '', disabled: false }],
            unlockMethod: ['code', Validators.required],
            fullName: ['', Validators.required],
            roomId: [this.room._id, Validators.required],
            propertyId: [this.room.propertyId, Validators.required],
            phoneNumber: this.fb.group({
                country: [{ value: 'sn', disabled: false }],
                phoneNumber: [{ value: '', disabled: false }]
            }),
        });

        // this.roomForm.get('contactType').valueChanges.subscribe(contactType => {
        //     const emailControl = this.roomForm.get('email');
        //     const phoneNumberGroup = this.roomForm.get('phoneNumber');

        //     if (contactType === 'email') {
        //         emailControl.enable();
        //         emailControl.setValidators([Validators.required, Validators.email]);
        //         phoneNumberGroup.disable();
        //         phoneNumberGroup.get('country').clearValidators();
        //         phoneNumberGroup.get('phoneNumber').clearValidators();
        //     } else {
        //         emailControl.disable();
        //         emailControl.clearValidators();
        //         phoneNumberGroup.enable();
        //         phoneNumberGroup.get('country').setValidators(Validators.required);
        //         phoneNumberGroup.get('phoneNumber').setValidators(Validators.required);
        //     }
        //     phoneNumberGroup.get('country').updateValueAndValidity();
        //     phoneNumberGroup.get('phoneNumber').updateValueAndValidity();
        // });
    }

    onClose(): void {
        this.dialogRef.close();
    }

    // Validator for check-out date
    checkOutDateValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            const checkOut = control.value;
            const checkIn = this.roomForm?.get('checkInDate')?.value;

            if (checkIn && checkOut) {
                return checkOut < checkIn ? { checkOutDate: true } : null;
            }
            return null;
        };
    }

    // Update minimum check-out date when check-in changes
    onCheckInChange() {
        const checkInDate = this.roomForm.get('checkInDate')?.value;
        if (checkInDate) {
            this.minCheckOutDate = checkInDate;
            this.roomForm.get('checkOutDate')?.updateValueAndValidity();
        }
    }

    onSubmit(): void {
        if (this.roomForm.valid) {
            // Create a copy of form values and convert dates
            const formValue = {
                ...this.roomForm.value,
                checkInDate: new Date(this.roomForm.value.checkInDate),
                checkOutDate: new Date(this.roomForm.value.checkOutDate)
            };

            const confirmation = this._fuseConfirmationService.open({
                title: 'Confirmation',
                message: 'Voulez-vous enregistrer ce check-in ?',
                actions: {
                    confirm: {
                        label: 'Enregistrer',
                    },
                    cancel: {
                        label: 'Annuler',
                    },
                },
            });

            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._checkInService.checkIn(formValue).subscribe({
                        next: (res) => {
                            Swal.fire({
                                title: 'Success',
                                text: 'Check-in enregistré avec succès',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
                                position: 'top-end',
                            });
                            this.dialogRef.close(res);
                        },
                        error: (err) => {
                            Swal.fire({
                                title: 'Error',
                                text: 'Erreur lors de l\'enregistrement du check-in',
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
    }

    private combineDateAndTime(date: Date, time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const combined = new Date(date);
        combined.setHours(hours, minutes);
        return combined;
    }

    getCountries() {
        this._contactsService.getCountries()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;
            });
    }

    getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }
}


// const checkInDateTime = this.combineDateAndTime(formValue.checkIn, formValue.checkInTime);
// const checkOutDateTime = this.combineDateAndTime(formValue.checkOut, formValue.checkOutTime);

// const submitData = {
//     ...formValue,
//     checkIn: checkInDateTime,
//     checkOut: checkOutDateTime
// };
