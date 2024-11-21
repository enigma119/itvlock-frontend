import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    styles: [
        `
            .mat-horizontal-stepper-header {
                height: 40px !important;
                border-radius: 3px !important;
            }
            .mat-step-text-label {
                font-size: 10px !important;
            }
        `
    ],
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatStepperModule,
    ],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    companyFormGroup: UntypedFormGroup;
    userFormGroup: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the company form
        this.companyFormGroup = this._formBuilder.group({
            companyName: ['', Validators.required],
            companyAddress: ['', Validators.required],
            companyEmail: ['', [Validators.required, Validators.email]],
            companyPhone: ['', Validators.required],
        });

        // Create the user form
        this.userFormGroup = this._formBuilder.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
            ]],
            phoneNumber: ['', Validators.required],
            agreements: [false, Validators.requiredTrue],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if either form is invalid
        if (this.companyFormGroup.invalid || this.userFormGroup.invalid) {
            return;
        }

        delete this.userFormGroup.value.agreements;

        // Combine both forms' values
        const signUpData = {
            ...this.companyFormGroup.value,
            ...{adminUser: this.userFormGroup.value}
        };

        // Disable both forms
        this.companyFormGroup.disable();
        this.userFormGroup.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(signUpData).subscribe({
            next: () => {
                Swal.fire({
                    title: 'Succès',
                    text: 'Votre compte a été créé avec succès. Veuillez vérifier votre email pour la confirmation.',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                });
                // Navigate to the confirmation required page
                this._router.navigateByUrl('/confirmation-required');
            },
            error: () => {
                // Re-enable both forms
                this.companyFormGroup.enable();
                this.userFormGroup.enable();

                // Reset both forms
                this.signUpNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Une erreur est survenue, veuillez réessayer.',
                };

                // Show the alert
                this.showAlert = true;
            },
        });
    }
}
