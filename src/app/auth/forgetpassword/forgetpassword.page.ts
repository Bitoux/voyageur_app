import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {

  constructor(private loadingController: LoadingController, private  authService:  AuthService, public alertController: AlertController) { }

  ngOnInit() {
  }

  sendPassword(form) {
    console.log(form.value.email);
    this.presentLoading();
    this.authService.forgetPassword(form.value.email).subscribe((res) => {
      this.dismissLoading();
      console.log(res);
      if(res.error && res.error.message === 'No Email'){
        this.errorAlert();
      }else{
        
      }
    }, (error) => {
      this.dismissLoading();
      console.log(error);
      this.errorAlert();
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
