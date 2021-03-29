import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.page.html',
  styleUrls: ['./home-list.page.scss'],
})
export class HomeListPage implements OnInit {
  longitude;
  latitude;
  locations;

  constructor(private loaderService: LoaderService, private apiService: ApiService) { }

  ngOnInit() {
  }

  requestNearestLocations(event){
    this.loaderService.presentLoading();
    this.apiService.get(`location/nearest/${this.longitude}/${this.latitude}`).subscribe((res) => {
      this.locations = res;
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    })

    if(event){
      event.target.complete();
    }
  }

}
