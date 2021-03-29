import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.page.html',
  styleUrls: ['./edit-location.page.scss'],
})
export class EditLocationPage implements OnInit {

  id;
  location;
  categories;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.presentLoading();
    this.route.paramMap.subscribe(queryParam => {
      this.id = queryParam.get('id');

      this.apiService.get('category/list').subscribe((res) => {
        this.categories = res;
        this.apiService.get(`location/single/${this.id}`).subscribe((res) => {
          this.location = res;
          this.loaderService.dismiss();
        }, (error) => {
          console.log(error);
          this.loaderService.dismiss();
        })
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
      })
    })
  }

  editLocation(form){
    let location = {
      id: this.location.id,
      name: form.form.value.name,
      description: form.form.value.description,
      longitude: form.form.value.longitude,
      latitude: form.form.value.latitude,
      category: form.value.category.id
    }

    this.apiService.put('location/edit', location).subscribe((res) => {
      this.loaderService.dismiss();
      this.router.navigateByUrl(`menu/locations/location/${this.location.id}`, {queryParams: {id: this.location.id}});
    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
    })
  }

  compareCategory(category1, category2){
    return category1 && category2 ? category1.id == category2.id : category1 == category2;
  }
}
