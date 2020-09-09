import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  login(form){
    this.authService.login(form.value).subscribe((res)=>{
      if(res.error && res.error.message === 'Invalid credentials.'){ // == 'Invalid credentials.'
        this.errorAlert();
      }else{
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

}
