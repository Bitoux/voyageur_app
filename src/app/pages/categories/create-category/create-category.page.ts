import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.page.html',
  styleUrls: ['./create-category.page.scss'],
})
export class CreateCategoryPage implements OnInit {

  colors;

  constructor(private loadingController: LoadingController, private apiService: ApiService, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.apiService.get('color/list').subscribe((res) => {
      this.colors = res;
    }, (error) => {
      console.log(error);
    });
  }

  createCategory(form){
    let category = {
      name: form.form.value.name,
      color: form.form.value.color.id
    }
    this.apiService.put('category/create', category).subscribe((res) => {
      this.dismissLoading();
      this.router.navigateByUrl('manu/categories');
    }, (error) => {
      console.log(error);
      this.dismissLoading();
    })
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
