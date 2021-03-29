import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  location;
  id;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.presentLoading();
    this.route.paramMap.subscribe(queryParams => {
      this.id = queryParams.get('id');


      this.apiService.get(`location/single/${this.id}`).subscribe((res) => {
      
        this.location = res;
        this.loaderService.dismiss();
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
      });
    });
  }

  editLocation(){
    this.router.navigateByUrl('/menu/locations/edit/' + this.id, {queryParams: {id: this.id}});
  }
}
