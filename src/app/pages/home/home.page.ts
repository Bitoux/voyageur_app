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
    this.requestNearestLocations(null);
    
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

  requestNearestLocations(event){
    this.presentLoading();
    this.longitude = '45.784851';//47.468179
    this.latitude = '1.483287';//1.377521
    this.apiService.get(`location/nearest/${this.longitude}/${this.latitude}`).subscribe((res) => {
      this.locations = this.prepareLocationArray(res);
      console.log(this.locations);
      this.dismissLoading();
      if(event){
        event.target.complete();
      }
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    });
  }

}
