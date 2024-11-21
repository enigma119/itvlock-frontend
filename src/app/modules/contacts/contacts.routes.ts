import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ContactsComponent } from 'app/modules/contacts/contacts.component';
import { ContactsService } from 'app/modules/contacts/contacts.service';
import { ContactsListComponent } from 'app/modules/contacts/list/list.component';


export default [
    {
        path: '',
        component: ContactsComponent,
        children: [
            {
                path: '',
                component: ContactsListComponent,
                resolve: {
                    countries: () => inject(ContactsService).getCountries(),
                }
            },
        ],
    },
] as Routes;
