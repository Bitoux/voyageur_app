import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLocationPageRoutingModule } from './edit-location-routing.module';

import { EditLocationPage } from './edit-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditLocationPageRoutingModule
  ],
  declarations: [EditLocationPage]
})
export class EditLocationPageModule {}
