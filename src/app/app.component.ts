import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { Data } from '../providers/data';


@Component({
  templateUrl: 'app.html'
  //template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;

  constructor(platform: Platform, dataService: Data) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('App Component');

      StatusBar.styleDefault();   
      Splashscreen.hide();

    });

  }

}
