import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { RoomDetailsComponent } from 'app/modules/room/details/details.component';
import { catchError, throwError } from 'rxjs';
import { RoomService } from './room.service';
import { RoomListComponent } from './list/list.component';
import { RoomComponent } from './room.component';

/**
 * Item resolver
 *
 * @param route
 * @param state
 */
const itemResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const roomService = inject(RoomService);
    const router = inject(Router);


    return roomService.getItemById(route.paramMap.get('id')).pipe(

        // Error here means the requested item is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate file manager details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateRoomDetails = (
    component: RoomDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/file-manager'
    // it means we are navigating away from the
    // file manager app
    if (!nextState.url.includes('/rooms')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another item...
    if (nextState.url.includes('/details')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: RoomComponent,
        children: [
            {
                path: '',
                component: RoomListComponent,
                resolve: {
                    items: () => inject(RoomService).getItems(),
                },
                children: [
                    {
                        path: 'details/:id',
                        component: RoomDetailsComponent,
                        // resolve: {
                        //     item: itemResolver,
                        // },
                        canDeactivate: [canDeactivateRoomDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
