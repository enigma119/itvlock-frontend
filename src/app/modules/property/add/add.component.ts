import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PropertyService } from '../property.service';
import Swal from 'sweetalert2'
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatIconModule } from '@angular/material/icon';
import { Amenity } from '../property.types';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    TextFieldModule,
    MatInputModule,
    MatOptionModule,
    MatDialogModule,
    MatIconModule,
  ],
})
export class AddPropertyComponent implements OnInit {

    propertyForm: UntypedFormGroup;
    amenities: Amenity[];

  constructor(
    private _propertyService: PropertyService,
    private _dialogRef: MatDialogRef<AddPropertyComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data: { amenities: Amenity[] }
  ) { }

  ngOnInit() {
    this.amenities = this.data.amenities;
    this.propertyForm = this._formBuilder.group({
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
        totalRooms: ['', [Validators.required]],
        amenities: [[]],
        });
    }

    createProperty(): void {
        if(this.propertyForm.invalid) {
            return;
        }
        const confirmation = this._fuseConfirmationService.open({
            title: 'Création de Bien',
            message: 'Voulez-vous créer ce bien ?',
            actions: {
                confirm: {
                    label: 'Confirmer',
                },
                cancel: {
                    label: 'Annuler',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.propertyForm.disable();
                this._propertyService.createProperty(this.propertyForm.value).subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'Félicitations !',
                            text: 'Bien créé avec succès',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        this._dialogRef.close();
                    },
                    error: (error) => {
                        this.propertyForm.enable();
                        Swal.fire({
                            title: 'Oups !',
                            text: 'Erreur lors de la création du bien',
                            icon: 'error',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2500
                        });
                    }
                });
            }
        });
    }

}
