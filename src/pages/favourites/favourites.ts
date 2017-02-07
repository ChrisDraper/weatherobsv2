import { Component } from '@angular/core';
import { Nav, NavController, ToastController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { HomePage } from '../../pages/home/home';
import { Search } from '../../pages/search/search';

/*
  Generated class for the Favourites page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class Favourites {

  favourites: Array<{title: string, locationid: any}>;

  constructor(public navCtrl: NavController,public dataService: Data, public nav: Nav, private toastCtrl: ToastController) {
     
  }

  ionViewDidLoad() {
    this.loadFavourites();
  }

  loadFavourites() {
      this.dataService.getLocationsList().then((result) => {
        if (result) {
          //console.log('Favourite list by data storage');
          this.favourites = result;  
        } else {
          //console.log('Favourite list default, no local storage')
          this.favourites = this.dataService.defaultLocations;
          this.dataService.saveLocationList(this.favourites);
        }
      });
  }

  showLocation(location) {
        this.nav.setRoot(HomePage, {
         location : location
     });
   }

  removeLocation(location) {   
      //console.log('Removing location', location);
      this.dataService.getLocationsList().then((result) => {
          result = result.filter(function( obj ) {
            return obj.locationid !== location.locationid;
          });
          console.log('Result ', result);
          this.dataService.saveLocationList(result);
          this.presentToast('Removing ' + location.title, 'top');
          setTimeout(() => {
              this.loadFavourites();
          }, 1000);
      });
   }  
   
   presentToast(message, position) {
    let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: position
    });
    toast.present();
  }  

  searchLocation() {
     this.navCtrl.push(Search, {});
  }

}
