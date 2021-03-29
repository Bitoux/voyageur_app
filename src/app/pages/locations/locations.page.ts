import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../loader.service';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  locations;

  constructor(private apiService: ApiService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.presentLoading();
    this.apiService.get('location/list').subscribe((res) => {
    
      this.locations = res;
      this.loaderService.dismiss();
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    });
  }

  deleteLocation(location, index){
    this.apiService.delete('location/delete/' + location.id).subscribe((res) => {
      this.locations.splice(index, 1);
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    })
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }

  navigateToAddLocation(){
    this.router.navigateByUrl('/menu/locations/create');
  }
}
