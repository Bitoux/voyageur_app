import { Component, OnInit } from '@angular/core';
import { Base64 } from '@ionic-native/base64/ngx';
import { ApiService } from '../../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.page.html',
  styleUrls: ['./create-location.page.scss'],
})
export class CreateLocationPage implements OnInit {

  categories;

  constructor(private loaderService: LoaderService, private base64: Base64, private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {

    this.apiService.get('category/list').subscribe((res) => {
      this.categories = res;
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    })
  }

  createLocation(form){
    this.loaderService.presentLoading();
    if(form.value.file){
      this.base64.encodeFile(form.value.file).then(base64File => {
      
        let location = {
          name: form.value.name,
          description: form.value.description,
          longitude: form.value.longitude,
          latitude: form.value.latitude,
          file: base64File,
          category: form.value.category.id
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
        latitude: form.value.latitude,
        category: form.value.category.id
      };
      this.createRequest(location);
        
    }
    

  }

  createRequest(location){
    this.apiService.put('location/create', location).subscribe((res) => {
      this.router.navigateByUrl('locations');
      this.loaderService.dismiss();
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    });
  }

}
