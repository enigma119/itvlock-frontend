import { inject, Injectable } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { forkJoin } from 'rxjs';
import { UserService } from './core/user/user.service';
import { catchError, of } from 'rxjs';

export const initialDataResolver = () => {
    const navigationService = inject(NavigationService);
    const shortcutsService = inject(ShortcutsService);
    const userService = inject(UserService);
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get(),
        userService.get(),
        shortcutsService.getAll(),
    ]);
};
