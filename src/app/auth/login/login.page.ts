import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router, public alertController: AlertController, private loaderService: LoaderService, private storage: Storage, private apiService: ApiService) { }

  ngOnInit() {
  }

  login(form){
    this.loaderService.presentLoading();
    this.authService.login(form.value).subscribe((res)=>{
      this.loaderService.dismiss();
      if(res.error && res.error.message === 'Invalid credentials.'){ // == 'Invalid credentials.'
        this.errorAlert();
      }else{
        this.getUser(form.value.email);
        
      }
    }, (error) => {
      this.loaderService.dismiss();
      this.errorAlert();
    });
  }

  getUser(email){
    this.apiService.get(`user/${encodeURIComponent(email)}`).subscribe((res) => {
        let user = {
          id: res.id,
          email: res.email,
          first_name: res.first_name,
          last_name: res.last_name,
          roles: res.roles
        };
        this.storage.set('user', JSON.stringify(user)).then(() => {
          this.router.navigateByUrl('');
        });
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    })
    
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
}
