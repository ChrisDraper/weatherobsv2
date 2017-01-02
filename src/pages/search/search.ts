import { Component } from '@angular/core';
import { Nav, NavController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
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

  appid: string;
  results: Array<{title: string, locationid: any}>;
  locationList: Array<{title: string, locationid: any}>;


  constructor(public navCtrl: NavController, public dataService: Data, public nav: Nav, public http: Http, private toastCtrl: ToastController) {
    
      this.appid = 'c52882f0-643b-4821-ad25-f2b8862ce289';
      this.dataService.getAPILocationsList().then((result) => {
        if (result) {
          console.log('Search Constructor: Location list from local storage');
          this.locationList = result;
        } else {
          console.log('Search Constructor: Get location list from API');
          this.loadLocationsFromAPI();
        }
      });

  }

  ionViewDidLoad() {
    
  }

  loadLocationsFromAPI() {
    console.log('Loading all locations from API');
    this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/sitelist?key=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    this.locationList = this.dataService.formatLocationList(data);
                    console.log('loadLocationsFromAPI: Save location list to local storage');
                    this.dataService.saveAPILocationList(this.locationList);
                  },
                  error => {
                    console.log(error);
                    this.locationList = [];
                    this.presentToast('An error occured connecting to the server', 'middle');
                  });
  }

  searchLocations(event) {
      this.results = this.locationList;

      // set q to the value of the searchbar
      var q = event.srcElement.value;

      // if the value is an empty string don't filter the items
      if (!q) {
        return;
      }

      this.results = this.results.filter((v) => {
        if(v.title && q) {
          if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });

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
    
    presentToast(message, position) {
    let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: position
    });
    toast.present();
  } 

}
