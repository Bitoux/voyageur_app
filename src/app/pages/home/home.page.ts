import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  locations;
  latitude;
  longitude;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.longitude = '45.784851';//47.468179
    this.latitude = '1.483287';//1.377521
    this.storage.get('token').then(token => {
      this.apiService.get(`location/nearest/${this.longitude}/${this.latitude}`, token, null).subscribe((res) => {
        if(res.error && res.error.message == 'JWT Token not found'){
          this.router.navigateByUrl('login');
        }else if(res.error && res.error.message == 'Expired JWT Token'){
          this.storage.get('refresh_token').then(refreshToken => {
            this.apiService.refreshToken(refreshToken).toPromise().then(data => {
              this.locations = this.apiService.get(`location/nearest/${this.longitude}/${this.latitude}`, data.token, null).subscribe(res => {
                this.locations = res;
              });
            })
          })
        }else{
          this.locations = this.prepareLocationArray(res);
        }
        this.dismissLoading();
      });
    });
  }

  prepareLocationArray(locations){
    let finalArray = [];
    locations.forEach(element => {
      let object = element[0];
      object.distance = element.distance;
      finalArray.push(object);
    });
    return finalArray;
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
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
