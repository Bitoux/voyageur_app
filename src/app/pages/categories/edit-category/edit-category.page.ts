import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.page.html',
  styleUrls: ['./edit-category.page.scss'],
})
export class EditCategoryPage implements OnInit {

  id;
  category;
  colors;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.route.paramMap.subscribe(queryParam => {
      this.id = queryParam.get('id');

      this.apiService.get('color/list').subscribe((res) => {
        this.colors = res;
        this.apiService.get(`category/${this.id}`).subscribe((res) => {
          this.category = res;
          this.colors.push(this.category.color);
          this.dismissLoading();
        }, (error) => {
          console.log(error);
          this.dismissLoading();
        });
      }, (error) => {
        console.log(error);
      });
    });
  }

  compareColor(color1, color2){
    console.log(color1, color2);
    return color1 && color2 ? color1.id == color2.id : color1 == color2;
  }

  editCategory(form){
    let category = {
      id: this.category.id,
      name: form.form.value.name,
      color: form.form.value.color.id
    };
    this.apiService.put('category/edit', category).subscribe((res) => {
      this.dismissLoading();
      this.router.navigateByUrl('menu/categories/category/' + this.category.id, {queryParams: {id: this.category.id}});
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
