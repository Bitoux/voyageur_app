import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../../api.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage implements OnInit {

  wrongPassword;
  user;

  constructor(private apiService: ApiService, private storage: Storage, private loadingController: LoadingController, private router: Router, private alertController: AlertController, private autService: AuthService) {
    this.wrongPassword = false;
  }

  ngOnInit() {
    this.presentLoading();

    this.storage.get('user').then(user => {
      this.user = JSON.parse(user);
      this.apiService.get(`user/${encodeURIComponent(this.user.email)}`).subscribe((res) => {
        Object.assign(this.user, res);
        this.user.new_email = this.user.email;
        this.dismissLoading();
      }, (error) => {
        console.log(error);
        this.dismissLoading();
      })
    });
  }

  editProfil(form) {
    if( (!form.value.passwrd && !form.value.repeat_password) || form.value.password && (form.value.password === form.value.repeat_password)){
      this.wrongPassword = false;
      this.user.password = form.value.password;
      this.user.repeat_password = form.value.repeat_password;

      this.apiService.post(`user/edit`, this.user).subscribe((res) => {
        if(res.email != this.user.email){
          this.storage.set('user', JSON.stringify({email: res.email})).then(() => {
            this.emailChangeAlert();
          })
        }else{
          this.router.navigateByUrl('/menu/settings');
        }
        
      }, (error) => {
        console.log(error);
        this.dismissLoading();
      })
    }else{
      this.wrongPassword = true;
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent'
    });
    await loading.present();
  }

  dismissLoading(){
    this.loadingController.dismiss();
  }

  async emailChangeAlert(){
    let alert = await this.alertController.create({
      header: 'Email changé',
      message: 'Vous allez être déconnecter, veuillez vous reconnecter avec votre nouvelle adresse email.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.autService.logout().then(() => {
              this.router.navigateByUrl('login');
            }); 
          }
        }
      ]
    });
    await alert.present();
  }

}
