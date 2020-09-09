import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsPage } from './locations.page';

const routes: Routes = [
  {
    path: '',
    component: LocationsPage
  },
  {
    path: 'location/:id',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./create-location/create-location.module').then( m => m.CreateLocationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsPageRoutingModule {}
