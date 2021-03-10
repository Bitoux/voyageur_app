import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../api.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  user;

  constructor(private apiService: ApiService, private storage: Storage, private loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
    this.presentLoading();
    this.storage.get('user').then(user => {

      this.user = JSON.parse(user);

      this.apiService.get(`user/${encodeURIComponent(this.user.email)}`).subscribe((res) => {
        this.user = res;
        this.dismissLoading();
      }, (error) => {
        console.log(error);
        this.dismissLoading();
      });
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait ...',
      spinner: 'bubbles'
    });
    await loading.present();
  }

  dismissLoading(){
    this.loadingController.dismiss();
  }

}
