// smart-devices-list.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DevicesService } from './devices.service';
import { UserService } from 'app/core/user/user.service';
import { Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { DevicesResponse, SmartDevice } from './devices.type';
import { Router, RouterModule } from '@angular/router';


@Component({
    selector: 'app-smart-devices-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatInputModule,
        MatTooltipModule,
        RouterModule
    ],
    template: `
    <div class="p-8">
      <!-- Search Bar -->
      <div class="mb-6 flex gap-2">
        <mat-form-field class="w-full">
          <input
            matInput
            placeholder="S'il vous plaît entrer le nom de verrouillage"
            [(ngModel)]="searchTerm"
          >
        </mat-form-field>
        <button mat-raised-button color="primary" class="h-14">
          rechercher
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 mb-4">
        <button mat-stroked-button color="primary">
          Émettre la carte IC
        </button>
        <button mat-icon-button>
          <mat-icon>share</mat-icon>
        </button>
        <button mat-icon-button>
          <mat-icon>lock</mat-icon>
        </button>
      </div>

      <!-- Devices Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <mat-card *ngFor="let device of devices" class="py-4">
          <div class="flex flex-col justify-between gap-2 mb-4 px-4">
            <h2 class="text-base font-medium">{{ device?.lockAlias }}</h2>
            <div class="flex items-center gap-6">
              <!-- Battery Icon -->
              <div class="flex items-center" [ngClass]="{
                'text-red-500': device?.electricQuantity < 20,
                'text-yellow-500': device?.electricQuantity >= 20 && device?.electricQuantity < 50,
                'text-green-500': device?.electricQuantity >= 50
              }">
                <mat-icon [svgIcon]="'heroicons_outline:battery-0'" class="text-sm icon-size-5"
                [ngClass]="{
                  'text-red-500': device?.electricQuantity < 20,
                  'text-yellow-500': device?.electricQuantity >= 20 && device?.electricQuantity < 50,
                  'text-green-500': device?.electricQuantity >= 50
                }"></mat-icon>
                <span class="text-sm ml-2">{{ device?.electricQuantity }}%</span>
              </div>
              <!-- WiFi Icon (if applicable) -->
              <div *ngIf="device?.hasGateway" class="flex items-center">
                <mat-icon [svgIcon]="'heroicons_outline:wifi'" class="text-sm icon-size-5"></mat-icon>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 border-t border-gray-200 px-3 pt-2">
            <button mat-icon-button [matTooltip]="'Envoyer E-key'">
              <mat-icon [svgIcon]="'heroicons_outline:key'" class="icon-size-5"></mat-icon>
            </button>
            <button mat-icon-button matTooltip="Envoyer un code d\'accès">
                <mat-icon [svgIcon]="'heroicons_outline:qr-code'" class="icon-size-5"></mat-icon>
            </button>
            <button mat-icon-button [matTooltip]="'Voir les paramètres'" (click)="goToDeviceDetails(device)">
                <mat-icon [svgIcon]="'heroicons_outline:cog-8-tooth'" class="icon-size-5"></mat-icon>
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class SmartDevicesListComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;
    devices: SmartDevice[] = [];

    searchTerm: string = '';
    constructor(
        private devicesService: DevicesService,
        private _userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getUser();
        this.getDevices();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getUser(): void {
        this._userService.user$.subscribe((user) => {
            this.user = user;
        });
    }

    getDevices(): void {
        this.devicesService.getDevices(this.user.tenantId).subscribe({
            next: (response: DevicesResponse) => {
                this.devices = response?.list || [];
                console.log(this.devices);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    goToDeviceDetails(device: SmartDevice): void {
        this.devicesService.setDevice(device);
        this.router.navigateByUrl(`/apps/devices/${device?.lockId}`);
    }
}
