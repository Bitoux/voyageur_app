import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  id;
  category;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.route.paramMap.subscribe(queryParam => {
      this.id = queryParam.get('id');

      this.apiService.get(`category/${this.id}`).subscribe((res) => {
        this.category = res;
        this.dismissLoading();
      }, (error) => {
        console.log(error);
        this.dismissLoading();
      });
    });
  }

  editCategory(){
    this.router.navigateByUrl('/menu/categories/edit/' + this.id, {queryParams: {id: this.id}});
  }

  navigationToLocation(location){
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

}
