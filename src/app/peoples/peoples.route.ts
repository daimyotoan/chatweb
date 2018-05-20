import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import {PeoplesComponent} from './peoples.component';

export const PeoplesRoutesModule: ModuleWithProviders = RouterModule.forChild([
    {
        path: '',
        component: PeoplesComponent,
    }
]);
