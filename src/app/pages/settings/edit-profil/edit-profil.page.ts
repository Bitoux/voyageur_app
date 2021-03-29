import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../../api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../auth/auth.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage implements OnInit {

  wrongPassword;
  user;

  constructor(private apiService: ApiService, private storage: Storage, private loaderService: LoaderService, private router: Router, private alertController: AlertController, private autService: AuthService) {
    this.wrongPassword = false;
  }

  ngOnInit() {
    this.loaderService.presentLoading();

    this.storage.get('user').then(user => {
      this.user = JSON.parse(user);
      this.apiService.get(`user/${encodeURIComponent(this.user.email)}`).subscribe((res) => {
        Object.assign(this.user, res);
        this.user.new_email = this.user.email;
        this.loaderService.dismiss();
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
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
        this.loaderService.dismiss();
      })
    }else{
      this.wrongPassword = true;
    }
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
