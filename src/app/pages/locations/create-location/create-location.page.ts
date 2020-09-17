import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Base64 } from '@ionic-native/base64/ngx';
import { ApiService } from '../../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.page.html',
  styleUrls: ['./create-location.page.scss'],
})
export class CreateLocationPage implements OnInit {

  constructor(private loadingController: LoadingController, private base64: Base64, private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {
  }

  createLocation(form){
    this.presentLoading();
    if(form.value.file){
      this.base64.encodeFile(form.value.file).then(base64File => {
      
        let location = {
          name: form.value.name,
          description: form.value.description,
          longitude: form.value.longitude,
          lataitude: form.value.latitude,
          file: base64File
        };
        this.createRequest(location);
        
      }).catch(reason => {
        console.log(reason);
      });
    }else{
      
      let location = {
        name: form.value.name,
        description: form.value.description,
        longitude: form.value.longitude,
        lataitude: form.value.latitude
      };
      this.createRequest(location);
        
    }
    

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

  createRequest(location){
    this.storage.get('token').then(token => {
      this.apiService.put('location/create', token, location).subscribe((res) => {
        if(res.error && res.error.message === 'JWT Token not found'){
          this.dismissLoading();
          this.router.navigateByUrl('login');
        }else if(res.error && res.error.message === 'Expired JWT Token'){
          this.storage.get('refresh_token').then(refreshToken => {
            this.apiService.refreshToken(refreshToken).toPromise().then(data => {
              this.apiService.put('location/create', data.token, location).subscribe(res => {
                this.router.navigateByUrl('locations');
                this.dismissLoading();
              })
            })
          });
        }else{
          this.router.navigateByUrl('locations');
          this.dismissLoading();
        }
      })
    })
  }

}
