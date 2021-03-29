import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private loaderService: LoaderService) { }

  ngOnInit() {
    console.log('On register');
  }

  register(form) {
    this.loaderService.presentLoading();
    this.authService.register(form.value).subscribe((res) => {
      this.router.navigateByUrl('');
      this.loaderService.dismiss();
    });
  }
}
