import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { Storage } from "@ionic/storage";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  location;
  id;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private storage: Storage, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
    this.presentLoading();
    this.route.paramMap.subscribe(queryParams => {
      this.id = queryParams.get('id');


      this.apiService.get(`location/${this.id}`).subscribe((res) => {
      
        this.location = res;
        this.dismissLoading();
      }, (error) => {
        console.log(error);
        this.dismissLoading();
      });
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait ...',
      spinner: 'bubbles'
    });
    await loading.present();
  }

  dismissLoading(){
    this.loadingController.dismiss();
  }

}
