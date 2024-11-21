import {
    Routes,
} from '@angular/router';
import { PropertyComponent } from './property.component';
import { PropertyListComponent } from './list/list.component';


export default [
    {
        path: '',
        component: PropertyComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: PropertyListComponent,
            },
            {
                path: 'rooms/:propertyId',
                loadChildren: () => import('app/modules/room/room.routes'),
            },
        ],
    },
] as Routes;
