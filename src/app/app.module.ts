import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Data } from '../providers/data';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { Search } from '../pages/search/search';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Search
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Search
  ],
  providers: [
    [Data, Storage]
  ]
})
export class AppModule {}
