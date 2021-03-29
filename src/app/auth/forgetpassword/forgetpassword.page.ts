import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {

  constructor(private loaderService: LoaderService, private  authService:  AuthService, public alertController: AlertController) { }

  ngOnInit() {
  }

  sendPassword(form) {
    console.log(form.value.email);
    this.loaderService.presentLoading();
    this.authService.forgetPassword(form.value.email).subscribe((res) => {
      this.loaderService.dismiss();
      console.log(res);
      if(res.error && res.error.message === 'No Email'){
        this.errorAlert();
      }else{
        
      }
    }, (error) => {
      this.loaderService.dismiss();
      console.log(error);
      this.errorAlert();
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
