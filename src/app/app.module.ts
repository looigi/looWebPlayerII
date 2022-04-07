import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from "./services/api2.service";
import { HttpModule } from '@angular/http';
import { HttpService } from './services/httpclient.service';
import {MatSliderModule} from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeviewModule } from 'ngx-treeview';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { TreeViewComponent } from './treeview/treeview.component';
import { AlbumComponent } from './gestionealbum/gestionealbum.component';
import { ImmaginiComponent } from './gestioneimmagini/gestioneimmagini.component';
import { FormsModule } from '@angular/forms';
import {ConnectionServiceModule} from 'ng-connection-service'; 
import { DatePipe } from '@angular/common';
import { CaricaBranoComponent } from './varie/caricabrano.component';
import { YouTubeComponent } from './varie/youtube.component';
import { UtilityComponent } from './varie/utility.component';
import { HappiComponent } from './varie/happi-dev.component';
import { CaricaBranoAutomaticoComponent } from './varie/caricabranoautomatico.component';
import { MusixMatchComponent } from './varie/musixmatch.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { VoiceRecognitionService } from './services/speech.service';
import { ComponentFile } from './varie/files';
import { File } from '@ionic-native/file/ngx';
import { StorageComponent } from './varie/storage.component';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { CheckReteComponent } from './varie/checkrete';
import { GestioneAndroidComponent } from './varie/gestione_android.component';
import { GestioneMusicaComponent } from './varie/gestonemusica.component';
import { FiltroComponent } from './filtrobrani/filtrobrani.component';
import { UploadBraniComponent } from './uploadbrani/uploadbrani.component';
@NgModule({
  declarations: [
    AppComponent,
    TreeViewComponent,
    AlbumComponent,
    ImmaginiComponent,    
    FiltroComponent,
    UploadBraniComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    YouTubePlayerModule,
    TreeviewModule.forRoot(),
    MatSliderModule,
    HttpModule,
    HttpClientModule,
    AngularDraggableModule,
    FormsModule,
    ConnectionServiceModule,
  ],
  providers: [
    HttpService,
    ApiService,
    YouTubeComponent,
    UtilityComponent,
    DatePipe,
    HappiComponent,
    MusixMatchComponent,
    CaricaBranoComponent,
    CaricaBranoAutomaticoComponent,
    ComponentFile,
    VoiceRecognitionService,
    File,
    StorageComponent,
    SpeechRecognition,
    SplashScreen,
    Media,
    // MediaObject,
    CheckReteComponent,
    GestioneAndroidComponent,
    GestioneMusicaComponent,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
