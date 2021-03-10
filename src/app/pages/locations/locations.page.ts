import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  locations;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.apiService.get('location/list').subscribe((res) => {
    
      this.locations = res;
      this.dismissLoading();
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    });
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }

  navigateToAddLocation(){
    this.router.navigateByUrl('/menu/locations/create');
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
