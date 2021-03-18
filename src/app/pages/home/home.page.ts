import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Map, tileLayer, Marker, icon, point, latLng, DivIcon } from 'leaflet';
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
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);
    
    setTimeout(() => {
      this.map.invalidateSize();
      this.requestNearestLocations(null);
      this.map.on('click', (e) => {
        console.log(e)
      })
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
      spinner: 'crescent'
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
      
    }, (error) => {
      console.log(error);
      console.log('Error', error);
      this.dismissLoading();
    });

    if(event){
      event.target.complete();
    }
  }

  putMarkers(){
    this.locations.forEach(location => {
      console.log(location);
      let marker = new Marker([location.latitude, location.longitude], {
        icon: new DivIcon({
          className: 'map-icon',
          html: `<div class="icon-container"><span class="icon"><?xml version="1.0" encoding="utf-8"?><svg style="width: 60px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" xml:space="preserve"><path fill="${location.category.color.hex}" class="path1" d="M8 2.1c1.1 0 2.2 0.5 3 1.3 0.8 0.9 1.3 1.9 1.3 3.1s-0.5 2.5-1.3 3.3l-3 3.1-3-3.1c-0.8-0.8-1.3-2-1.3-3.3 0-1.2 0.4-2.2 1.3-3.1 0.8-0.8 1.9-1.3 3-1.3z"></path><path fill="#fff" class="path2" d="M8 15.8l-4.4-4.6c-1.2-1.2-1.9-2.9-1.9-4.7 0-1.7 0.6-3.2 1.8-4.5 1.3-1.2 2.8-1.8 4.5-1.8s3.2 0.7 4.4 1.9c1.2 1.2 1.8 2.8 1.8 4.5s-0.7 3.5-1.8 4.7l-4.4 4.5zM4 10.7l4 4.1 3.9-4.1c1-1.1 1.6-2.6 1.6-4.2 0-1.5-0.6-2.9-1.6-4s-2.4-1.7-3.9-1.7-2.9 0.6-4 1.7c-1 1.1-1.6 2.5-1.6 4 0 1.6 0.6 3.2 1.6 4.2v0z"></path><path fill="#fff" class="path3" d="M8 16l-4.5-4.7c-1.2-1.2-1.9-3-1.9-4.8 0-1.7 0.6-3.3 1.9-4.6 1.2-1.2 2.8-1.9 4.5-1.9s3.3 0.7 4.5 1.9c1.2 1.3 1.9 2.9 1.9 4.6 0 1.8-0.7 3.6-1.9 4.8l-4.5 4.7zM8 0.3c-1.6 0-3.2 0.7-4.3 1.9-1.2 1.2-1.8 2.7-1.8 4.3 0 1.7 0.7 3.4 1.8 4.5l4.3 4.5 4.3-4.5c1.1-1.2 1.8-2.9 1.8-4.5s-0.6-3.1-1.8-4.4c-1.2-1.1-2.7-1.8-4.3-1.8zM8 15.1l-4.1-4.2c-1-1.2-1.7-2.8-1.7-4.4s0.6-3 1.7-4.1c1.1-1.1 2.6-1.7 4.1-1.7s3 0.6 4.1 1.7c1.1 1.1 1.7 2.6 1.7 4.1 0 1.6-0.6 3.2-1.7 4.3l-4.1 4.3zM4.2 10.6l3.8 4 3.8-4c1-1 1.6-2.6 1.6-4.1s-0.6-2.8-1.6-3.9c-1-1-2.4-1.6-3.8-1.6s-2.8 0.6-3.8 1.6c-1 1.1-1.6 2.4-1.6 3.9 0 1.6 0.6 3.1 1.6 4.1v0z"></path></svg></span></div>`,
          iconSize: [60, 42],
        })
      });
      marker.bindPopup(`<h3>${location.name}</h3>`);
      marker.addTo(this.map);
    });
  }

}
