import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  location;
  id;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(queryParams => {
      this.id = queryParams.get('id');
      this.storage.get('token').then(token => {
        this.apiService.get(`location/${this.id}`, token, null).subscribe((res) => {
          if(res.error && res.error.message == 'JWT Token not found') {
            this.router.navigateByUrl('login');
          }else if(res.error && res.error.message === 'Expired JWT Token'){
            this.storage.get('refresh_token').then(refreshToken => {
              this.apiService.refreshToken(refreshToken).toPromise().then(data => {
                this.location = this.apiService.get(`location/${this.id}`, data.token, null).subscribe(res => {
                  this.location = res
                });
              })
            })
          }else{
            this.location = res;
          }
        });
      });
    });
  }

}
