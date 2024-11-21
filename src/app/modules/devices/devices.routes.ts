import { Routes } from '@angular/router';
import { SmartDevicesListComponent } from './devices.component';
import { SmartDeviceDetailsComponent } from './device-details.component';
export default [
    {
        path     : '',
        component: SmartDevicesListComponent
    },
    {
        path     : ':id',
        component: SmartDeviceDetailsComponent
    }
] as Routes;
