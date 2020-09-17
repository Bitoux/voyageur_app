import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router, public alertController: AlertController, private loadingController: LoadingController, private storage: Storage) { }

  ngOnInit() {
  }

  login(form){
    this.presentLoading();
    this.authService.login(form.value).subscribe((res)=>{
      this.dismissLoading();
      if(res.error && res.error.message === 'Invalid credentials.'){ // == 'Invalid credentials.'
        this.errorAlert();
      }else{
        let user = {
          email: form.value.email
        }
        this.storage.set('user', JSON.stringify(user));
        this.router.navigateByUrl('');
      }
    });
  }

  async errorAlert(){
    let alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'There was an error during login',
      message: 'Wrong credentials, please try again or create a acount',
      buttons: ['OK']
    });
    await alert.present();
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
