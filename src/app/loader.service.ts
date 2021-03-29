import { Injectable } from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public loadingController: LoadingController) { }

  async presentLoading() {
    await this.dismiss();
    await this.loadingController.create({
      spinner: 'crescent'
    }).then(res => {
      res.present();
    });
  }

  /**
   * Dismiss all the pending loaders, if any
   */
   async dismiss() {
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }
}
