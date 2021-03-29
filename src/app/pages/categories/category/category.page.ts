import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  id;
  category;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.presentLoading();
    this.route.paramMap.subscribe(queryParam => {
      this.id = queryParam.get('id');

      this.apiService.get(`category/${this.id}`).subscribe((res) => {
        this.category = res;
        this.loaderService.dismiss();
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
      });
    });
  }

  editCategory(){
    this.router.navigateByUrl('/menu/categories/edit/' + this.id, {queryParams: {id: this.id}});
  }

  navigationToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }
}
