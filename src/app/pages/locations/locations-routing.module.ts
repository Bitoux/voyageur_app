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
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit-location/edit-location.module').then( m => m.EditLocationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsPageRoutingModule {}
