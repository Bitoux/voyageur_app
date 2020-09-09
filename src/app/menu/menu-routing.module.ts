import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('../pages/locations/locations.module').then(m => m.LocationsPageModule)
      },
      {
        path: 'locations/:id',
        loadChildren: () => import('../pages/locations/location/location.module').then(m => m.LocationPageModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('../auth/login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
