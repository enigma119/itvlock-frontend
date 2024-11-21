// smart-device-details.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DevicesService } from './devices.service';
import { Subject, Subscription } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DeviceDetails } from './devices.type';

interface EKey {
    nom: string;
    compteBeneficiaire: string;
    assignateur: string;
    tempsAttribution: string;
    periodeValidite: string;
    statut: string;
}

@Component({
    selector: 'app-smart-device-details',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatMenuModule,
        FormsModule,
        RouterModule
    ],
    template: `
    <div class="p-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm mb-6">
        <a href="#" class="text-gray-600" [routerLink]="['/apps/devices']">Accueil</a>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900">Informations sur le verrouillage</span>
      </div>

      <!-- Device Header -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h1 class="text-xl font-medium">{{ device?.lockAlias }}</h1>
            <button mat-icon-button>
              <mat-icon class="icon-size-5" [svgIcon]="'heroicons_outline:share'"></mat-icon>
            </button>
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

                <button mat-icon-button>
                <mat-icon class="icon-size-5" [svgIcon]="'heroicons_outline:cog-8-tooth'"></mat-icon>
                </button>
          </div>

          <div class="flex gap-2">
            <button mat-stroked-button [matMenuTriggerFor]="distanceMenu">
              À distance
              <!-- <mat-icon class="icon-size-5" [svgIcon]="'heroicons_outline:arrow-down'"></mat-icon> -->
            </button>
            <mat-menu #distanceMenu="matMenu">
              <button mat-menu-item>Option 1</button>
              <button mat-menu-item>Option 2</button>
            </mat-menu>

            <button mat-stroked-button [matMenuTriggerFor]="exportMenu">
              Exporter
              <!-- <mat-icon class="icon-size-5" [svgIcon]="'heroicons_outline:arrow-down'"></mat-icon> -->
            </button>
            <mat-menu #exportMenu="matMenu">
              <button mat-menu-item>Option 1</button>
              <button mat-menu-item>Option 2</button>
            </mat-menu>

            <button mat-stroked-button color="primary" [matMenuTriggerFor]="changeMenu">
              Chambre
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #changeMenu="matMenu">
              <button mat-menu-item>Option 1</button>
              <button mat-menu-item>Option 2</button>
            </mat-menu>
          </div>
        </div>

        <div class="mt-2 text-gray-600">
          Administrateur / Permanent
        </div>
      </div>

      <!-- Tabs Section -->
      <mat-tab-group>
        <mat-tab label="eKeys">
          <div class="py-4">
            <!-- Search and Actions -->
            <div class="flex justify-between mb-4">
              <mat-form-field class="w-96">
                <input matInput placeholder="Veuillez entrer le nom et le compte du destinataire">
                <mat-icon class="icon-size-5" [svgIcon]="'heroicons_outline:magnifying-glass'"></mat-icon>
              </mat-form-field>

              <div class="flex gap-2">
                <button mat-raised-button color="primary">
                  Envoyer eKey
                </button>
                <button mat-stroked-button color="warn">
                  Supprimer tout
                </button>
              </div>
            </div>

            <!-- Table -->
            <table mat-table [dataSource]="dataSource" class="w-full">
              <!-- Nom Column -->
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef>Nom</th>
                <td mat-cell *matCellDef="let element">{{element.nom}}</td>
              </ng-container>

              <!-- Compte bénéficiaire Column -->
              <ng-container matColumnDef="compteBeneficiaire">
                <th mat-header-cell *matHeaderCellDef>Compte bénéficiaire</th>
                <td mat-cell *matCellDef="let element">{{element.compteBeneficiaire}}</td>
              </ng-container>

              <!-- Assignateur Column -->
              <ng-container matColumnDef="assignateur">
                <th mat-header-cell *matHeaderCellDef>Assignateur</th>
                <td mat-cell *matCellDef="let element">{{element.assignateur}}</td>
              </ng-container>

              <!-- Temps d'attribution Column -->
              <ng-container matColumnDef="tempsAttribution">
                <th mat-header-cell *matHeaderCellDef>Temps d'attribution</th>
                <td mat-cell *matCellDef="let element">{{element.tempsAttribution}}</td>
              </ng-container>

              <!-- Période de validité Column -->
              <ng-container matColumnDef="periodeValidite">
                <th mat-header-cell *matHeaderCellDef>Période de validité</th>
                <td mat-cell *matCellDef="let element">{{element.periodeValidite}}</td>
              </ng-container>

              <!-- Statut Column -->
              <ng-container matColumnDef="statut">
                <th mat-header-cell *matHeaderCellDef>Statut</th>
                <td mat-cell *matCellDef="let element">{{element.statut}}</td>
              </ng-container>

              <!-- Operation Column -->
              <ng-container matColumnDef="operation">
                <th mat-header-cell *matHeaderCellDef>Opération</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button>
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- Empty State -->
            <div *ngIf="dataSource.length === 0" class="text-center py-16">
              <img src="/api/placeholder/100/100" alt="No data" class="mx-auto mb-4">
              <p class="text-gray-500">Aucune donnée disponible</p>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Codes d'accès"></mat-tab>
        <mat-tab label="Cartes IC"></mat-tab>
        <mat-tab label="Empreintes digitales"></mat-tab>
        <mat-tab label="Dossiers"></mat-tab>
      </mat-tab-group>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    .mat-mdc-tab-group {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
  `]
})
export class SmartDeviceDetailsComponent implements OnInit, OnDestroy {
    user: User;
    lockId: number;
    device: DeviceDetails;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private devicesService: DevicesService,
        private activatedRoute: ActivatedRoute,
        private _userService: UserService
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.lockId = params['id'];
            console.log(this.lockId);
        });
    }


    ngOnInit(): void {
        this.getUser();
        this.getDeviceData();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getUser(): void {
        this._userService.user$.subscribe((user) => {
            this.user = user;
        });
    }

    getDeviceData(): void {
        this.devicesService.device$.subscribe((data) => {
            if (data) {
                this.device = data;
                console.log(data);
            } else {
                this.getDeviceFromApi();
            }
        });
    }

    getDeviceFromApi(): void {
        this.devicesService.getDeviceDetails(this.lockId, this.user.tenantId).subscribe({
            next: (data: DeviceDetails) => {
                this.device = data;
                console.log(data);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }




    displayedColumns: string[] = [
        'nom',
        'compteBeneficiaire',
        'assignateur',
        'tempsAttribution',
        'periodeValidite',
        'statut',
        'operation'
    ];

    dataSource: EKey[] = [];
}
