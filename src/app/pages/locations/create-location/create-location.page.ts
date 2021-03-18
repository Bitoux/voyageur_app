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

  categories;

  constructor(private loadingController: LoadingController, private base64: Base64, private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {

    this.apiService.get('category/list').subscribe((res) => {
      this.categories = res;
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    })
  }

  createLocation(form){
    this.presentLoading();
    if(form.value.file){
      this.base64.encodeFile(form.value.file).then(base64File => {
      
        let location = {
          name: form.value.name,
          description: form.value.description,
          longitude: form.value.longitude,
          latitude: form.value.latitude,
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
        latitude: form.value.latitude
      };
      this.createRequest(location);
        
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

  createRequest(location){
    this.apiService.put('location/create', location).subscribe((res) => {
      this.router.navigateByUrl('locations');
      this.dismissLoading();
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    });
  }

}
