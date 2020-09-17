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
      this.storage.get('token').then(token => {

        this.apiService.get(`user/${encodeURIComponent(this.user.email)}`, token, null).subscribe((res) => {
          if(res.error && res.error.message == 'JWT Token not found') {
            this.router.navigateByUrl('login');
          }else if(res.error && res.error.message === 'Expired JWT Token') {
            this.storage.get('refresh_token').then(refreshToken => {
              this.apiService.refreshToken(refreshToken).toPromise().then(data => {
                this.apiService.get(`user/${encodeURIComponent(this.user.email)}`, data.token, null).subscribe((res) => {
                  this.user = res;
                })
              })
            })
          }else{
            this.user = res;
          }
          this.dismissLoading();
        })
      })
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
