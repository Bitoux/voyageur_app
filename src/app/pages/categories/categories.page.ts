import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    
    this.refreshCategory(null)
  }

  refreshCategory(event){
    this.presentLoading();
    this.apiService.get('category/list').subscribe((res) => {
      
      this.categories = res;
      this.dismissLoading();

    }, (error) => {
      console.log(error);
      this.dismissLoading();
    });

    if(event){
      event.target.complete();
    }
  }

  navigateToAddCategory(){
    this.router.navigateByUrl('menu/categories/create');
  }

  navigationToCategory(category){
    this.router.navigateByUrl('menu/categories/category/' + category.id, {queryParams: {id:category.id}});
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
