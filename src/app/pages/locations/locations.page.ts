import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  locations;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.storage.get('token').then(token => {
      this.apiService.get('location/list', token, null).subscribe((res) => {
        //console.log('MESSAGE', res.error.message);
        if(res.error && res.error.message === 'JWT Token not found'){
          this.router.navigateByUrl('login');
        }else if(res.error && res.error.message === 'Expired JWT Token'){
          this.storage.get('refresh_token').then(refreshToken => {
            this.apiService.refreshToken(refreshToken).toPromise().then(data => {
              this.apiService.get('location/list', data.token, null).subscribe(res => {
                this.locations = res;
              });
            });
          });
        }else{
          this.locations = res;
        }
      });
    });
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }

  navigateToAddLocation(){
    this.router.navigateByUrl('/menu/locations/create');
  }

}
