import { Component } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { HomePage } from '../../pages/home/home';
import { Favourites } from '../../pages/favourites/favourites';
/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

  results: Array<{title: string, locationid: any}>;

  constructor(public navCtrl: NavController, public dataService: Data, public nav: Nav) {
    
      this.results = dataService.getSearchResults('Search');

  }

  ionViewDidLoad() {
    
  }

  showResult(location) {
        this.dataService.addLocationToList(location);
        this.nav.setRoot(HomePage, {
         location : location
     });
   }
   
   showFavourites() {
     this.navCtrl.push(Favourites, {});
    }

}
