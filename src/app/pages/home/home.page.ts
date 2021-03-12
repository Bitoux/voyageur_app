import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Map, tileLayer, Marker, icon, point, latLng } from 'leaflet';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  locations;
  latitude;
  longitude;
  map;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router, private loadingController: LoadingController, private platform: Platform) { }

  ngOnInit() {
    
    this.map = new Map('map').setView([48.8534, 2.3488], 9);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a target="_blank" href="https://www.mapbox.com/">Mapbox</a>',
      // maxZoom: 18,
      // id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      // accessToken: 'pk.eyJ1IjoiYml0b3V4IiwiYSI6ImNrbTY0NTVuODBrZWkycG54OWF4cDgydHIifQ.tBiWv0nsjDcTCQ4AyGnUQA'
    }).addTo(this.map);
    
    setTimeout(() => {
      this.map.invalidateSize();
      this.requestNearestLocations(null);
    })
    
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
      this.putMarkers();
      this.dismissLoading();
      if(event){
        event.target.complete();
      }
    }, (error) => {
      console.log(error);
      console.log('Error', error);
      this.dismissLoading();
    });
  }

  putMarkers(){
    this.locations.forEach(location => {
      console.log(location);
      Marker([location.latitude, location.longitude]).addTo(this.map)
    });
  }

}
