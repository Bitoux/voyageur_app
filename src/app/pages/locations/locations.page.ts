import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  locations;

  constructor(private apiService: ApiService, private router: Router, private loadingController: LoadingController) { }

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

  deleteLocation(location, index){
    this.apiService.delete('location/delete/' + location.id).subscribe((res) => {
      this.locations.splice(index, 1);
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    })
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }

  navigateToAddLocation(){
    this.router.navigateByUrl('/menu/locations/create');
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

}
