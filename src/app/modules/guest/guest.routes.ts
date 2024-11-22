import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { GuestListComponent } from './list/list.component';
export default [
    {
        path: '',
        component: GuestListComponent,
        children: [
            {
                path: '',
                component: GuestListComponent,
            },
        ],
    },
] as Routes;
