import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    private router:Router
  ) {
    setTimeout(()=>{
      this.router.navigateByUrl('home/registro');
    },6000);
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    SplashScreen.hide();
  }

}
