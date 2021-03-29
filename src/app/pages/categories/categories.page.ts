import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories;

  constructor(private apiService: ApiService, private storage: Storage, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    
    this.refreshCategory(null)
  }

  refreshCategory(event){
    this.loaderService.presentLoading();
    this.apiService.get('category/list').subscribe((res) => {
      
      this.categories = res;
      this.loaderService.dismiss();

    }, (error) => {
      console.log(error);
      this.loaderService.dismiss();
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
}
