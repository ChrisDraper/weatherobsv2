import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Data } from '../providers/data';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { Search } from '../pages/search/search';
import { Favourites } from '../pages/favourites/favourites';
import { Connectivity } from '../providers/connectivity';
import { GoogleMaps } from '../providers/googlemaps';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Search,
    Favourites
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Search,
    Favourites
  ],
  providers: [
    [Data, Storage, Connectivity, GoogleMaps]
  ]
})
export class AppModule {}
