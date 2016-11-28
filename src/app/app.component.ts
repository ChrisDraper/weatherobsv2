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
  locations: Array<{title: string, locationid: any}>;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();      
      Splashscreen.hide();

        this.locations = [
          { title: 'Lyneham', locationid: '3740' },
          { title: 'Tulloch Bridge', locationid: '3047' },
          { title: 'Benson', locationid: '3658' },
          { title: 'Manston', locationid: '352522' },
          { title: 'London Gatwick', locationid: '352414' },
          { title: 'Glenanne', locationid: '3923' }
        ];
    });

  }
  showLocation(location) {
        this.nav.setRoot(HomePage, {
         location : location
     });
   }

}
