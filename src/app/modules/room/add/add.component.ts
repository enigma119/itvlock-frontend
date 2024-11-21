import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2'
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-add-room',
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
export class AddRoomComponent implements OnInit {

    roomForm: UntypedFormGroup;

  constructor(
    private _roomService: RoomService,
    private _dialogRef: MatDialogRef<AddRoomComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data: { propertyId: string }
  ) { }

  ngOnInit() {
    this.roomForm = this._formBuilder.group({
        roomName: ['', [Validators.required]],
        roomNumber: ['', [Validators.required]],
        propertyId: [this.data.propertyId],
        });
    }

    createRoom(): void {
        if(this.roomForm.invalid) {
            return;
        }
        const confirmation = this._fuseConfirmationService.open({
            title: 'Création de chambre',
            message: 'Voulez-vous créer cette chambre ?',
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
                this.roomForm.disable();
                this._roomService.createRoom(this.roomForm.value).subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'Félicitations !',
                            text: 'Chambre créée avec succès',
                            icon: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2500
                        });
                        this._dialogRef.close();
                    },
                    error: (error) => {
                        this.roomForm.enable();
                        Swal.fire({
                            title: 'Oups !',
                            text: 'Erreur lors de la création de la chambre',
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
