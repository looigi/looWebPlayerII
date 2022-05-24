
import { AfterViewInit, Component, ElementRef, ErrorHandler, Inject, NgZone, OnInit, SecurityContext, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { MatSliderChange } from '@angular/material/slider';
import { TreeviewItem } from 'ngx-treeview';
import { HttpService } from './services/httpclient.service';
import { DomSanitizer, ɵELEMENT_PROBE_PROVIDERS__POST_R3__ } from '@angular/platform-browser';
import { fade } from './animations';
import { DatePipe, DOCUMENT } from '@angular/common';
import { saveAs } from 'file-saver';
import { timeStamp } from 'console';
import { ConnectionService } from 'ng-connection-service';
import { ThrowStmt } from '@angular/compiler';
import { CaricaBranoComponent } from './varie/caricabrano.component';
import { ComponentFile } from './varie/files';
import { YouTubeComponent } from './varie/youtube.component';
import { UtilityComponent } from './varie/utility.component';
import { HappiComponent } from './varie/happi-dev.component';
import { CaricaBranoAutomaticoComponent } from './varie/caricabranoautomatico.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpHeaders } from '@angular/common/http';
import { VoiceRecognitionService } from './services/speech.service';
import { StorageComponent } from './varie/storage.component';
import { SpeechRecognitionListeningOptions, SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Alert } from 'selenium-webdriver';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import { timer } from 'rxjs/observable/timer'
import { Observable } from 'rxjs/observable'
// import * as workerTimers from 'worker-timers';
import { ClasseTimer } from './varie/classetimer.component';
import { CheckReteComponent } from './varie/checkrete';
import { GestioneAndroidComponent } from './varie/gestione_android.component';
import { MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { ApiService } from './services/api2.service';
// import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: fade,
  providers: [VoiceRecognitionService]
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("videoPlayer", { static: false }) videoplayer;
  @ViewChild('videoPlayerLocale', { static: false }) videoplayerLocale: ElementRef;
  @ViewChild("divImmagine1", { static: false }) divImmagine1;
  @ViewChild("divImmagine2", { static: false }) divImmagine2;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  testoScrollabile = ['', ''];
  scrollTimer = [null, null];
  posizioneCarattere = [0, 0];
  lunghezzaCampo = [0, 0];

  debug = false;
  // moadalitaLite = true;
  debuggone = '';
  debuggone2 = '';
  filtroImpostatoDebug = '';
  ultimaVoltaLettoBrani = -1;
  braniSD = '';
  visuaTagBrano = false;
  mascheraUploadVisibile = false;
  esclusioni = '';
  visuaTasti = true;
  Utenti;
  mostraSceltaUtenti = false;
  passwordBox = false;
  utenteScelto;
  pwd = '';
  numeroBranoAttuale = -1;
  
  zIndex = [ 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011 ];
  nomiDiv = [ '', 'divDebug', 'divFiltroBrani', 'divListaBrani', 
            'divInfoArtista', 'divMenu', 'divOpzioni',
            'divUtility', 'divGestioneBrani', 'divUguali', 'divTesto',
            'divBarraTasti' ];
  lastClickZIndex = -1;

  filtroStandard = [ 'MP3MICA', 'MP3ANGEL', 'CARTON' ];

  caricamentoInCorso = false;
  letturaSD = false;
  cartellaEsaminata = '';

  menuMostrato = false;
  mascheraFiltroBrani = false;
  mascheraBrani = false;
  mascheraOpzioni = false;
  mascheraArtisti = false;
  mascheraTesto = false;
  mascheraAbout = false;

  caricamentoInCorsoIA = false;
  pannelloUtility = false;
  vecchioMilli = 0;
  // tutteLeCanzoni = true;
  canzoniMamma = false;
  eliminaMamma = false;
  consideraStelle = false;
  numeroStelle = 5;
  letteraItem;
  filtroImpostato = '';
  title = 'looWebPlayer';
  immagineSfondo = '';
  immagineBrano;
  titoloBrano = '';
  titoloBranoPerTesto = '';
  estensioneBrano = '';
  artista = '';
  anno;
  traccia;
  dataBrano;
  dimensione;
  album = '';
  random = 'S';
  // visuaTesto = 'S';
  staSuonando = false;
  pathBrano = '';
  audio = new Audio();
  audioAndroid: MediaObject;
  tipo = '';
  // interval;
  intervalSalvataggio;
  intervalDurata;
  inizioImmagini = -1;
  quanteImmagini;
  opacita = .95;
  youTubeVideos;
  // bellezzeJSON;
  immaginiArtista;
  quantiBraniFiltrati = 0;
  quantiBraniTutti = 0;
  tuttiIBrani;
  brani = '';
  volteAscoltatoBrano = 0;
  immaginiCambiate = 0;
  mascheraGestioneBrani = false;
  mascheraGestioneUguali = false;
  albumSelezionato;
  uguali;
  ugualiDettaglio;
  ugualiSelezionato;
  staAspettandoCaricamento = false;
  impostatoBranoFinito = false;
  checkRicaricaBraniLocali = false;
  staLeggendoBrano = false;

  intervalImmagine;
  opacitaImmagine1 = .75;
  opacitaImmagine2 = 1;
  sfuma = true;
  cicla = true;
  finitoAttesa = false;
  erroreImmagine = false;

  scritte;
  qualeScritta = 0;
  intervalScritte;
  contaTimerScritte = 0;
  canzoniLocali = false;

  state = 'in';
  counter = 0;
  enableAnimation = false;
  appoSfondo = '';

  numeroBrano = -1;
  quantiBrani = -1;
  immagini;
  ascoltati = new Array();
  ascoltate = 0;
  ascoltata = 0;
  durata = 1;
  posizioneBrano = 0;
  contaTimer = 0;
  contaTimerSalvataggio = 0;
  contaTimerOpacity = 0;
  utenza = '';
  idUtenza = -1;
  Amministratore = '';
  braniFiltrati;
  //ultimoFiltroArray;
  nonSalvareFiltro = true;
  datiJSON;
  // datiJSONAccorpati;
  bellezza = ['', '', '', '', '', '', '', ''];
  linguaggio = 'OR';
  linguaggioIcona = '';

  volteAscoltata;
  testo;
  testoTradotto;

  tempoPassato = '';
  tempoTotale = '';
  tempoTotaleBrano = -1;
  scaricatoAutomaticamente = false;
  vecchioConsideraStelle = undefined;

  urlsArtista;
  dischiArtista;
  membriArtista;

  configTV = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 500
  };
  itemsCanzoni;
  itemsCanzoniFiltrate;

  modalitaYouTube = 'N';
  videoSource = '';
  urlWS = '';
  urlMP3 = '';
  urlImmagine = '';

  staCaricandoVideo = false;
  numeroVideo = -1;

  elem;
  bTuttoSchermo = false;

  bRicercaBrano = false;
  testoRicerca = '';
  listaFiltrata;
  hover;

  // operazioneInCorso = '';

  timerInterval1;
  timerInterval2;

  videoNONCaricato;

  messaggioVisualizzato = false;
  messaggio;
  timerMessaggio;
  coloreSfondoMessaggio;
  maiVotate = false;
  
  deviceGirante = '';
  fFiles = ComponentFile;
  imms;
  isConnected = true;  
  noInternetConnection: boolean;
  caricatoProssimoBrano = -1;
  titoloBranoAutomatico = '';

  limitaBrani = false;
  numeroLimiteBrani = 100;

  branoPresenteSuSD = false;
  // haEseguitoGiaIlCostruttore = false;
  pathBranoProssimo = '';
  cuffieAttive = false;
  lastCanzoniLocali = undefined;
  lastIsConnected = undefined;
  lastConsideraStelle = undefined;
  lastMaiVotate = undefined;

  public tt = this;
  lastDown = 0;
  lastUp = 0;
  speechDisponibile = undefined;
  comandiVocaliAttivi = false;
  comandoVocale = '';

  // os;
  // isMobile;
  // isTablet;
  // isDesktopDevice;
  pathApp;
  ceCordova;
  // userAgent;
  // browser;
  // device;
  // osVers;

  classeTimer;

  mostraAggiungeTag = false;
  tagsBrano;
  listaTags;
  listaTagsVisualizzati;
  nuovoTag = '';
  tagsRicerca;

  urlPerUpload;
  branoTerminato = false;

  // public tt = this;
  // cuffie = new CuffieComponent();

  constructor(
    private http: HttpService,
    // private backgroundMode: BackgroundMode,
    // private files: ComponentFile,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    public ytComponent: YouTubeComponent,
    public utility: UtilityComponent,
    private connectionService: ConnectionService,
    private Happi: HappiComponent,
    public caricaBrano: CaricaBranoComponent,
    private caricaBranoAutomatico: CaricaBranoAutomaticoComponent,
    @Inject(DOCUMENT) private document: any,
    public speechService : VoiceRecognitionService,
    private file: ComponentFile,
    public storage: StorageComponent,
    private speechRecognition: SpeechRecognition,
    private splashScreen: SplashScreen,
    // private deviceService: DeviceDetectorService,
    private checkRete: CheckReteComponent,
    public gestAndroid: GestioneAndroidComponent,
  ) {    
    this.splashScreen.show();
    
    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown() {
      if (confirm('Chiudo il player ?')) {
        navigator['app'].exitApp();
      }
    }
  }

  prendeLivelloSegnale() {
  }

  azionaVoce(disponibile) {
    return;

    if (this.comandiVocaliAttivi === false) {
      return;
    }

    const options: SpeechRecognitionListeningOptions = {
      language: 'it-IT',
      matches: 9999,
      showPopup: false,
      showPartial: true
    };
    let lastDetto = '';

    if (disponibile) {
      this.utility.scriveDebug(this, 'Speech recognition attivato');

      this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
          // this._ngZone.run(() => {
            this.utility.scriveDebug(this, 'Speech recognition lunghezza match: ' + matches.length);
            matches.forEach(element => {
              this.utility.scriveDebug(this, 'Speech recognition elementi: ' + element);
            });

            const detto = (matches.length > 0) ? matches[matches.length - 1] : "";
            if (detto && detto !== '' && detto !== lastDetto) {
              lastDetto = detto;

              this.comandoVocale = detto;
              // alert(detto);
  
              this.utility.parsaTesto(this, detto);
            }
          // });
        },
        (onerror) => {
          this.utility.scriveDebug(this, 'Speech recognition error: ' + onerror);

          setTimeout(() => {
            this.azionaVoce(this.speechDisponibile);
          }, 100);
        }
      )
    } else {
      alert('Speech recognition non disponibile');
    }
  }

  attivaMonitorConnessione() {
    this.utility.scriveDebug(this, 'Controllo Connessione internet');
    this.apiService.impostaConnesso(true);
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      this.apiService.impostaConnesso(isConnected);
      this.utility.scriveDebug(this, 'Connessione internet:' + isConnected);
      /* if (this.deviceGirante === 'Android') {
        if (isConnected === false) {
          this.utility.scriveDebug(this, 'Connessione internet mancante. Attivo brani locali');
          this.lastCanzoniLocali = this.canzoniLocali;
          this.lastConsideraStelle = this.consideraStelle;
          this.lastMaiVotate = this.maiVotate;          
          this.lastIsConnected = isConnected;

          this.canzoniLocali = true;
          this.consideraStelle = false;
          this.maiVotate = false;
          this.utility.filtraBrani(this);
        } else {
          if (this.canzoniLocali === undefined) {
            this.utility.scriveDebug(this, 'Connessione internet attiva.');
            this.canzoniLocali =  localStorage.getItem('CanzoniLocali') === 'S' ? true : false;
            this.consideraStelle =  localStorage.getItem('ConsideraStelle') === 'S' ? true : false;
            this.maiVotate =  localStorage.getItem('maiVotate') === 'S' ? true : false;
      
            this.utility.filtraBrani(this);
          } else {
            if (this.lastIsConnected !== undefined) {
              this.lastIsConnected = undefined;
              this.utility.scriveDebug(this, 'Connessione internet attiva. Imposto ultimo canzoni locali');
              this.canzoniLocali = this.lastCanzoniLocali;
              this.consideraStelle = this.lastConsideraStelle;
              this.maiVotate = this.lastMaiVotate;    
              this.utility.filtraBrani(this);
            }
          }
        }
      } */
      if (this.isConnected) {  
        this.noInternetConnection=false;  
      } else {  
        this.noInternetConnection=true;  
      }  
    });
  }

  attivaCuffie(tt) {
    // document.addEventListener("deviceready", onDeviceReady.bind(null, t), false);
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      tt.scriveDebug('Detector cuffie attivato');
      window['HeadsetDetection'].registerRemoteEvents(function(status) {
        tt.scriveDebug('Detector cuffie. Cambio status: ' + status);
        switch (status) {
          case 'headsetAdded':
            tt.scriveDebug('Cuffie attaccate');
            tt.cuffieAttive = true;
            break;
          case 'headsetRemoved':
            tt.scriveDebug('Cuffie staccate');
            tt.cuffieAttive = false;
            if (tt.staSuonando) {
              tt.play(true);
            }
            break;
        };
      });

      /* document.addEventListener("startcallbutton", onStartCallKeyDown, false);
      function onStartCallKeyDown() {
        alert('Premuto tasto inizio chiamata');
      }
      this.utility.scriveDebug(this, 'Attivato controllo inizio chiamata');

      document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);
      function onVolumeDownKeyDown() {
        const ora = Date.now();
        if (ora - tt.lastDown < 1000) {
          tt.scriveDebug('Indietro canzone');
          tt.indietroBrano();
        } else {
          // tt.audio.setVolume(10);
          // tt.scriveDebug('Premuto tasto volume giù');
        }
        tt.lastDown = ora;
      }
      // this.utility.scriveDebug(this, 'Attivato controllo volume giù');

      document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);
      function onVolumeUpKeyDown() {
        const ora = Date.now();
        if (ora - tt.lastUp < 1000) {
          tt.scriveDebug('Avanti canzone');
          tt.avantiBrano();
        } else {
          // tt.audio.setVolume(90);
          // tt.scriveDebug('Premuto tasto volume sù');
        }
        tt.lastUp = ora;
      }
      // this.utility.scriveDebug(this, 'Attivato controllo volume sù'); */
      
      /* document.addEventListener("backbutton", onBackKeyDown, false);
      function onBackKeyDown() {
        if (confirm('Chiudo il player ?')) {
          navigator['app'].exitApp();
        }
      } */  
      // this.utility.scriveDebug(this, 'Attivato controllo tasto indietro');
    }
    // document.addEventListener("deviceready", onDeviceReady.bind(this), false);
  }

  // controllaFileLocali() {
    /* if (this.deviceGirante === 'Android') {
      // setTimeout(() => {
        const indice = 3;
        ComponentFile.esisteFile[indice] = '';
        const cartellaJSON1 = 'LooigiSoft';
        const nomeFileJSON1 = 'looWebPlayer/jsonBraniLocali.json';
        this.utility.scriveDebug(this, 'Controllo esistenza file locale jsonBraniLocali.json');
  
        this.file.checkIfFileExists(this, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
          this.utility.scriveDebug(this, 'Esiste file locale jsonBraniLocali.json: ' + Ritorno);
          if (Ritorno === 'SI') {
            setTimeout(() => {
              this.leggeFileBraniLocali();
            }, 100);
          } else {
            setTimeout(() => {
              this.files.prendeTuttiIFilesInLocale(this, indice).then((Ritorno) => {
                this.sistemaStrutturaBraniLocali(true);
              });
            }, 10);
  
            /* let q = 0;
            const si2 = setInterval(() => {
              if (!ComponentFile.staLeggendoFiles[indice] && this.datiJSON) {
                this.utility.scriveDebug(this, 'Files locali letti');
                clearInterval(si2);
  
                this.sistemaStrutturaBraniLocali(true);
              } else {
                q++;
                if (q > 100) {
                  clearInterval(si2);
                  this.utility.visualizzaMessaggio(this, 'Problemi nel caricare il JSON', true);
                }
              }
            }, 1000);
          }
        }); */
      // }, 5000);

      /* let q = 0;
      const t1 = setInterval(() => {
        if (ComponentFile.esisteFile[indice] !== '') {
          // alert('Esistenza file brani locali: ' + Files.esisteFile);
          clearInterval(t1);

          if (this.checkRicaricaBraniLocali === true) {
            ComponentFile.esisteFile[indice] = 'NO';
          }

          if (ComponentFile.esisteFile[indice] === 'SI') {
            this.utility.scriveDebug(this, 'Esiste file locale jsonBraniLocali.json');
            ComponentFile.staLeggendoFiles[indice] = false;
            this.leggeFileBraniLocali();
          } else {            
            setTimeout(() => {
              this.utility.scriveDebug(this, 'NON Esiste file locale jsonBraniLocali.json');
              ComponentFile.staLeggendoFiles[indice] = true;
              this.files.prendeTuttiIFilesInLocale(this, indice);

              let q = 0;
              const si2 = setInterval(() => {
                if (!ComponentFile.staLeggendoFiles[indice] && this.datiJSON) {
                  this.utility.scriveDebug(this, 'Files locali letti');
                  clearInterval(si2);

                  this.sistemaStrutturaBraniLocali(true);
                } else {
                  q++;
                  if (q > 100) {
                    clearInterval(si2);
                    this.utility.visualizzaMessaggio(this, 'Problemi nel caricare il JSON', true);
                  }
                }
              }, 1000);      
            }, 100);
          }
        }
      }, 1000);
    } */
  // }

  scaricaJSON() {
    return new Promise(async (Ritorno) => {
      this.utility.scriveDebug(this, "Scarico JSON");

      this.getJSON(this).subscribe(data => {
        this.utility.scriveDebug(this, "Scaricato JSON");

        this.parsaJSON1(data, true);

        Ritorno('OK');
      });
    });
  }

  private getJSON(t): Observable<any> {
    this.utility.scriveDebug(this, 'Prende JSON di configurazione');
    return this.http.get(t, 'assets/config.json?id=' + new Date());
  }

  parsaJSON1(data, scriviFile) {
    const d = JSON.parse(data._body);
    this.urlWS = d.url;
    this.urlMP3 = d.urlMP3;
    this.urlImmagine = d.urlImmagine;
    this.apiService.impostaUrlWS(d.url);
    this.apiService.impostaUrlMP3(d.urlMP3);
    this.apiService.impostaUrlImmagine(d.urlImmagine);
    this.urlPerUpload = d.urlUpload;

    this.utility.scriveDebug(this, 'Url: ' +  this.urlWS);
    this.utility.scriveDebug(this, 'Url Immagini: ' +  this.urlImmagine);
    this.utility.scriveDebug(this, 'Url Upload: ' +  this.urlPerUpload);
    // return;
    // console.log(d.url, d.urlImmagine);

    // console.log(this.numeroBrano);
    // console.log(this.ultimoFiltro);

    // if (scriviFile && this.deviceGirante === 'Android') {
    //   Files.writeFile(this.cartellaJSON1, this.nomeFileJSON1, JSON.stringify(d));
    // }

    // this.creaUtenza();

    UtilityComponent.haEseguitoGiaIlCostruttore = true;
    this.utility.scriveDebug(this, 'Impostato flag già eseguito il costruttore: ' + UtilityComponent.haEseguitoGiaIlCostruttore);
  }

  ngOnInit() {
    if (UtilityComponent.haEseguitoGiaIlCostruttore) {
      return;
    }

    this.staAspettandoCaricamento = true;

    this.apiService.impostaThis(this, this.utility);
    this.storage.leggeSettaggi(this);

    this.utility.scriveDebug(this, "Costruttore 1");

    // const devServ = this.deviceService.getDeviceInfo();
    // this.os = devServ.os;
    // this.userAgent = devServ.userAgent;
    // this.browser = devServ.browser;
    // this.device = devServ.device;
    // this.osVers = devServ.os_version;
    // this.isMobile = this.deviceService.isMobile();
    // this.isTablet = this.deviceService.isTablet();
    // this.isDesktopDevice = this.deviceService.isDesktop();

    this.pathApp = document.URL;
    if (this.pathApp.indexOf( 'http://' ) === -1 && this.pathApp.indexOf( 'https://' ) === -1) {
      this.deviceGirante = 'Android';
    } else {
      this.deviceGirante = 'Web Page';
    }
    // this.deviceGirante = 'Android';

    this.utility.scriveDebug(this, "Costruttore 2");

    if(window['cordova']){
      // console.log("Cordova found")
      // alert('Cordova trovato');
      this.ceCordova = true;
      // document.addEventListener('deviceready', this.iniziaTutto);
    } else {
      // console.log("Cordova not found")
      // alert('Cordova NON trovato');
      this.ceCordova = false;
    }

    // setTimeout(() => {
      this.utility.scriveDebug(this, "Costruttore 3");

      this.splashScreen.hide();

      this.utenza = localStorage.getItem('utenza');
      this.idUtenza = +localStorage.getItem('idUtenza');
      this.Amministratore = localStorage.getItem('tipoUtente');
  
      this.attivaMonitorConnessione();

      const t = localStorage.getItem('tutteLeCanzoni');
      this.filtroImpostato = localStorage.getItem('FiltroTesto');
      this.canzoniMamma =  localStorage.getItem('CanzoniMamma') === 'S' ? true : false;
      this.eliminaMamma =  localStorage.getItem('TutteCanzoni') === 'S' ? true : false;
      if (this.isConnected === true) {
        this.consideraStelle =  localStorage.getItem('ConsideraStelle') === 'S' ? true : false;
        this.canzoniLocali =  localStorage.getItem('CanzoniLocali') === 'S' ? true : false;
        this.maiVotate =  localStorage.getItem('maiVotate') === 'S' ? true : false;
  
        if (this.deviceGirante !== 'Android') {
          this.canzoniLocali = false;
        }
      } else {
        if (this.deviceGirante === 'Android') {
          this.utility.scriveDebug(this, 'Connessione non valida. Imposto solo canzoni locali');
          this.canzoniLocali =  true;
          this.consideraStelle = false;
          this.maiVotate = false;
        }
      }
      
      // if (this.canzoniMamma === true) {
        // this.filtroImpostato = '';
      // }
      const tutte = t === 'S' ? true : false;
  
      this.controllaEsistenzaCookieBellezza();
      
      /* setTimeout(() => {
        this.mascheraBrani = true;
        setTimeout(() => {
          this.mascheraBrani = false;
          // console.log(this.ultimoFiltroArray);
        }, 100);
      }, 100); */
      this.nonSalvareFiltro = false;
  
      // console.log('UTENZA / ID', this.utenza, this.idUtenza);
      this.utility.scriveDebug(this, "Utenza: " + this.idUtenza + ' - ' + this.utenza + ' (' + this.Amministratore + ')');

      this.titoloBranoAutomatico = '';
      this.fFiles.operazioneSuFile = '';
    
      const tag = document.createElement('script');
  
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      this.elem = document.documentElement;

      this.numeroBrano = +localStorage.getItem('numero_brano');
      this.numeroBranoAttuale = +localStorage.getItem('numero_brano');
      
      this.scaricaJSON().then((Ritorno) => {
        if (Ritorno === 'OK') {
          this.utility.scriveDebug(this, 'Ricerca utenza:' + Ritorno);
          if (this.isConnected) {
            this.utility.cercaUtenza(this).then((Ritorno) => {
              this.utility.scriveDebug(this, 'Ricercata utenza:' + Ritorno);
              if (Ritorno === 'OK') {
                this.checkRete.settaFramePrincipale(this);
                this.checkRete.AttivaControllo();
      
                if (this.deviceGirante === 'Android') {
                  this.gestAndroid.iniziaTutto(this);
                } else {
                  this.iniziaTutto();
                }
              } else {
                this.utility.scriveDebug(this, 'Problemi nella lettura dell\'utenza: ' + Ritorno);
              }
            });
          } else {
            // Mancanza di rete. Per il momento vedo se esiste il cookie dell'utenza
            if (!this.utenza || this.utenza === null || this.utenza === '') {
              if (this.deviceGirante === 'Android') {
                this.gestAndroid.iniziaTutto(this);
              } else {
                this.iniziaTutto();
              }
          } else {
              // Non c'è... Muoio così
              alert('Mancanza di rete e del cookie dell\'utenza');
            }
          }
        } else {
          // Non è riuscito a scaricare il file config.json
        }
      });

    // }, 2000);

    this.settaZIndex(this.nomiDiv.length - 1);
  }

  iniziaTutto() {
    // setTimeout(() => {
      this.utility.scriveDebug(this, 'Inizia tutto');

      // this.caricamentoInCorso = true;
  
      // setTimeout(() => {
        /* this.utility.scriveDebug(this, 'Costruttore: Ha Già eseguito: ' + UtilityComponent.haEseguitoGiaIlCostruttore);
        if (UtilityComponent.haEseguitoGiaIlCostruttore === true) {
          return;
        } */
    
        /* const app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if ( app ) {
          this.deviceGirante = 'Android';
        } else {
          this.deviceGirante = 'Web Page';
        } */
    
        // this.utility.scriveDebug(this, 'Device:' + this.deviceGirante);
    
        // console.log(this.ultimoFiltroArray);
    
        /* if (this.deviceGirante === 'Android') {
          this.controllaFileLocali();

          this.prendeLivelloSegnale();
        }
        this.utility.scriveDebug(this, "Init 2"); */

        // this.scaricaJSON();
        // this.utility.scriveDebug(this, "Init 3");
        
        /* if (this.deviceGirante === 'Android') {
          if (this.comandiVocaliAttivi === true) {
            // Recognition delle chiacchiere Android
            this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
    
              if (!hasPermission) {
              this.speechRecognition.requestPermission()
                .then(
                  () => console.log('Granted'),
                  () => console.log('Denied')
                )
              }
            });
    
            this.speechRecognition.isRecognitionAvailable()
              .then((available: boolean) => { this.speechDisponibile = available; this.azionaVoce(available); } )
            // Recognition delle chiacchiere Android
          }
    
          this.attivaCuffie(this);
        } else {    
          if (this.comandiVocaliAttivi === true) {
            // Recognition delle chiacchiere Windows
            this.speechService.init(this);
            this.speechService.start();  
            // Recognition delle chiacchiere Windows
          }
        } */
    
        // setTimeout(() => {
        // this.utility.scriveDebug(this, "Init 3");
        // }, 100);
      // }, 100);
      
      // this.leggeTags();
      // this.utility.scriveDebug(this, "Init 4");
      // }, 100);
      this.utility.caricaJsonBrani(this).then((Ritorno: string) => {
        if (Ritorno.indexOf('ERROR: ') === -1) {
            let ok = true;
            // console.log(JSON.parse(Ritorno));
            try {
              this.datiJSON = JSON.parse(Ritorno);
            } catch (e) {
              ok = false;
              this.apiService.eliminaJSON(this, this.idUtenza)
              .map(response => this.apiService.controllaRitorno(response))
                .subscribe(
                  data => {
                    alert('Problemi nel leggere il json dei brani. Struttura non valida.\nRiavviare l\'applicazione');
                  }
              );
            }
            
            if (ok) {
              this.utility.prosegueCaricaJsonBrani2(this, false);

              this.prosegueCaricaTutto();
          
              this.impostaBellezza();

              this.leggeTags();

              this.caricaBranoDaID();

              this.startTimerScritte();
            }
        } else {
          // Problemi nel caricare il json dei brani
          alert('Problemi nel caricare il json dei brani');
        }
    });
  }

  leggeTags() {
    this.utility.scriveDebug(this, "Lettura Tags: Inizio");
    const t = setInterval(() => {
      if (this.apiService.urlWS) {
        this.utility.scriveDebug(this, "Lettura Tags: Lettura");
        clearInterval(t);
        this.listaTags = new Array();
        this.apiService.ritornaTuttiITags()
        .map(response => this.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              this.utility.scriveDebug(this, "Lettura Tags: Fine");
              if (data2.indexOf('ERROR:') === -1) {
                if (data2 && data2 !== '') {
                  const dd = data2.split('§');
                  dd.forEach(element => {
                    if (element && element !== '') {
                      const d2 = element.split(';');
                      const tt = {
                        idTag: +d2[0],
                        Tag: d2[1]
                      }
                      this.listaTags.push(tt);
                    }
                  });
                }
                // console.log(this.listaTags);
              }
            },
          (error) => {
            if (error instanceof Error) {
              this.utility.visualizzaMessaggio(this, 'Lettura Lista Tags: ' + error.message, true);
            }
        });
      }
    }, 1000)
  }

  ngAfterViewInit() {
    // console.log('Div tree', this.divToScroll);
    // this.scrollaTesto('divTestScroll', this.testoProva, 0);
  }

  // caricaTutto() {
    // alert('3');
    // console.log(this.idUtenza, this.utenza);
    // this.utility.scriveDebug(this, 'Carica tutto 1');

    /* if (this.deviceGirante === 'Android') {
      const indice = 4;
      ComponentFile.esisteFile[indice] = '';
      const cartellaJSON1 = 'LooigiSoft';
      const nomeFileJSON1 = 'looWebPlayer/jsonBrani.json'
      this.utility.scriveDebug(this, 'Esiste file locale jsonBrani.json');

      this.file.checkIfFileExists(this, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
        this.utility.scriveDebug(this, 'Esiste file locale jsonBrani.json: ' + Ritorno);
        if (Ritorno === 'SI') {
          this.leggeFileBrani();
        } else {
          this.continuaACaricareTutto();
        }
      });
    } else {
      this.caricaJsonBrani();
    }
    if (this.isConnected) {
      this.caricaJsonBrani();
    } else {
      if (this.deviceGirante === 'Android') {
        const indice = 4;
        ComponentFile.esisteFile[indice] = '';
        const cartellaJSON1 = 'LooigiSoft';
        const nomeFileJSON1 = 'looWebPlayer/jsonBrani.json'
        this.utility.scriveDebug(this, 'Esiste file locale jsonBrani.json');

        this.file.checkIfFileExists(this, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
          this.utility.scriveDebug(this, 'Esiste file locale jsonBrani.json: ' + Ritorno);
          if (Ritorno === 'SI') {
            this.leggeFileBrani();
          } else {
            // this.continuaACaricareTutto();
            this.utility.scriveDebug(this, 'Connessione di rete non presente e file json non presente in locale.<br />Stoppo tutto');
          }
        });
      } */
    // }
  // }

  /* continuaACaricareTutto() {
    if (this.isConnected) {
      this.caricaJsonBrani();
    } else {
      this.leggeFileBrani();
    }
  } */

  /* leggeFileBrani() {
    if (this.datiJSON) {
      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaLettoBrani < 500 && this.ultimaVoltaLettoBrani !== -1) {
      return;
    }
    this.ultimaVoltaLettoBrani = ora;
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // alert('5');
    if (this.deviceGirante === 'Android') {
      const indice = 0;
      this.caricamentoInCorso = false;

      ComponentFile.fileJSON[indice] = '';
      const path = ComponentFile.pathSD + '/LooigiSoft/looWebPlayer/jsonBrani.json'
      this.file.readFile(this, path, indice).then((Ritorno: string) => {
        this.datiJSON = JSON.parse(Ritorno);
        this.utility.scriveDebug(this, 'Letto file locale jsonBrani.json. Righe ' + this.datiJSON.length);

        this.prosegueCaricaTutto();
        this.caricaBranoDaID();
      });
      /* const si = setInterval(() => {
        if (ComponentFile.fileJSON[indice] !== '') {
          // alert('6');
          clearInterval(si);

          this.datiJSON = JSON.parse(ComponentFile.fileJSON[indice]);
          this.utility.scriveDebug(this, 'Letto file locale jsonBrani.json. Righe ' + this.datiJSON.length);

          this.prosegueCaricaTutto();
          this.prosegueCaricaJSON();
        }
      }, 100) */
    // } else {
    //   this.prosegueCaricaTutto();
    //   this.caricaBranoDaID();
    // }
  // } */

  prosegueCaricaTutto() {  
    // let c = 0;
    // const t = setInterval(() => {
      // console.log('Attesa dati json', new Date());
      // c++;
      // this.utility.scriveDebug(this, 'Attesa dati json: ' + c);
      // if (this.datiJSON) {
        // clearInterval(t);
        this.utility.scriveDebug(this, 'Letto file locale jsonBrani.json 2. Filtro brani');

        /* const b = new Array();
        const bb = { Ascoltata: 0, Estensione: '.mp3', id: 90000, Stelle: 0, path: 'W Pippetto', Text: 'Pippo Pippo', Traccia: '00', locale: true };
        b.push(bb);
        const n = { text: 'Brani SD', collapsed: true, children: [{ Anno: '0000', collapsed: true, text: 'Locale', children: b }] };
        this.datiJSON.push(n); */
        
        // console.log('Dati json arrivati', this.datiJSON);
        this.utility.filtraBrani(this);
        
        // this.utility.apreTree(this);
        // this.apreAlbero = !this.apreAlbero;

        // this.braniFiltrati = JSON.parse(JSON.stringify(this.braniFiltrati));
        // console.log(this.braniFiltrati);
        // console.log(this.bellezzeJSON);
        // console.log(this.numeroBrano);
      // }
    // }, 1000)
  }

  impostaDatiJSON(d) {
    this.datiJSON = d;

    this.utility.filtraBrani(this);
  }

  caricaBranoDaID() {    
    /* const t = localStorage.getItem('tutteLeCanzoni');
    this.filtroImpostato = localStorage.getItem('FiltroTesto');
    this.canzoniMamma =  localStorage.getItem('CanzoniMamma') === 'S' ? true : false;
    this.eliminaMamma =  localStorage.getItem('TutteCanzoni') === 'S' ? true : false;
    if (this.isConnected === true) {
      this.consideraStelle =  localStorage.getItem('ConsideraStelle') === 'S' ? true : false;
      this.canzoniLocali =  localStorage.getItem('CanzoniLocali') === 'S' ? true : false;
      this.maiVotate =  localStorage.getItem('maiVotate') === 'S' ? true : false;

      if (this.deviceGirante !== 'Android') {
        this.canzoniLocali = false;
      }
    } else {
      if (this.deviceGirante === 'Android') {
        this.utility.scriveDebug(this, 'Connessione non valida. Imposto solo canzoni locali');
        this.canzoniLocali =  true;
        this.consideraStelle = false;
        this.maiVotate = false;
      }
    }
    
    // if (this.canzoniMamma === true) {
      // this.filtroImpostato = '';
    // }
    const tutte = t === 'S' ? true : false;

    this.controllaEsistenzaCookieBellezza();
    
    /* setTimeout(() => {
      this.mascheraBrani = true;
      setTimeout(() => {
        this.mascheraBrani = false;
        // console.log(this.ultimoFiltroArray);
      }, 100);
    }, 100); */
    // this.nonSalvareFiltro = false; 

    this.utility.scriveDebug(this, 'Caricato tutto 2. Caricato JSON brani');

    if (this.numeroBrano === 0) {
      this.numeroBrano = 1;
      this.numeroBranoAttuale = 1;
      this.utility.scriveDebug(this, 'Caricato tutto 3. Carico brano ' + this.numeroBrano);
      this.caricaBrano.caricaBrano(this);
      this.ascoltata++;
      this.ascoltati.push(this.numeroBrano);
    } else {
      this.utility.scriveDebug(this, 'Caricato tutto 4. Carico brano ' + this.numeroBrano);
      this.caricaBrano.caricaBrano(this);
      this.ascoltata++;
      this.ascoltati.push(this.numeroBrano);
      // console.log(this.variabiliGlobali.urlWS, this.variabiliGlobali.urlPerUpload);
    }

    this.utility.scriveDebug(this, 'Carico JSON brani. TERMINATO');

    // this.attivaMonitorConnessione();
  }

  /* nonHaTrovatoJSON() {
    this.apiService.ritornaJSONBrani(
      this.idUtenza
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        this.caricamentoInCorso = false;
        this.utility.scriveDebug(this, 'Carico JSON brani: OK');
        // alert('2: ' + data);
        if (data) { 
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          if (data2.indexOf('ERROR:') === -1 && data2.length > 10) {
            try {
              this.datiJSON = JSON.parse(data2);
            } catch (e) {
              console.log('Problemi sul dati JSON');
              this.refreshCanzoniSenzaDomanda();
            }
  
            if (this.deviceGirante === 'Android') {
              this.file.writeFile(this, 6, 'LooigiSoft', 'looWebPlayer/jsonBrani.json', JSON.stringify(this.datiJSON)).then((Ritorno) => {

              });
            }

            this.prosegueCaricaJSON();
          } else {
            // alert('data2');
            this.utility.visualizzaMessaggio(this, 'Carica JSON: ' + data2, true);
          }
        } else {
          // alert('Nessun dato ricevuto');
          this.utility.visualizzaMessaggio(this, 'Carica JSON: Nessun dato ricevuto', true);
        }
      },
      (error) => {
        this.caricamentoInCorso = false;
        this.utility.visualizzaMessaggio(this, 'Carica JSON: ' + error.message, true);
      }
    );
  } */

  caricaDettaglioArtista(forza) {
    if (!this.isConnected) {
      return;
    }

    this.caricamentoInCorsoIA = true;
    // console.log('Prendo dettaglio artista', this.artista);
    this.urlsArtista = new Array();
    this.dischiArtista = new Array();
    this.membriArtista = new Array();

    this.apiService.tornaDettagliArtista(
      this.artista,
      forza
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        this.caricamentoInCorso = false;

        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          const campi = data2.split('|');
          const dettaglioArtista = campi[0];
          const sUrl = campi[1];
          const sDischi = campi[2];
          const sMembri = campi[3];
          
          if (sUrl && sUrl !== '') {
            const url = sUrl.split('§');
            url.forEach(element => {
              if (element !== '') {
                const c = element.split(';');
                const u = {
                  Indirizzo: this.utility.effettuaReplace(this.utility.effettuaReplace(c[0], '*PI*', '|'), '*PV*', ';'),
                  Tipologia: c[1]
                };
                this.urlsArtista.push(u);
              }
            });
          }

          if (sDischi && sDischi !== '') {
            const dischi = sDischi.split('§');
            dischi.forEach(element => {
              if (element !== '') {
                const c = element.split(';');
                let ok = true;
                this.dischiArtista.forEach(element2 => {
                  if (ok && element2.Titolo === c[0]) {
                    ok = false;
                  }
                });
                if (ok) {
                  const u = {
                    Titolo: this.utility.effettuaReplace(this.utility.effettuaReplace(c[0], '*PI*', '|'), '*PV*', ';'),
                    DataDisco: c[1],
                    Tipologia: this.utility.effettuaReplace(this.utility.effettuaReplace(c[2], '*PI*', '|'), '*PV*', ';'),
                    Presente: c[3]
                  };
                  this.dischiArtista.push(u);
                }
              }
            });
            this.dischiArtista.sort((a, b) => b.DataDisco.localeCompare(a.DataDisco));
          }

          if (sMembri && sMembri !== '') {
            const membri = sMembri.split('§');
            membri.forEach(element => {
              if (element !== '') {
                const c = element.split(';');
                const u = {
                  Nome: this.utility.effettuaReplace(this.utility.effettuaReplace(c[0], '*PI*', '|'), '*PV*', ';'),
                  Tipologia: this.utility.effettuaReplace(this.utility.effettuaReplace(c[1], '*PI*', '|'), '*PV*', ';'),
                  Inizio: c[2],
                  Fine: c[3],
                  Finito: c[4],
                  TipoArtista: this.utility.effettuaReplace(this.utility.effettuaReplace(c[5], '*PI*', '|'), '*PV*', ';'),
                  Ruolo: c[6],
                  Sesso: c[7],
                  Nazione: c[8],
                  Citta: c[9],
                  DataNascita: c[10],
                  DataMorte: c[11]
                };                
                this.membriArtista.push(u);

                if (u.Finito === 'N' && u.TipoArtista === 'Person') {
                  if (u.Inizio) {
                    this.scritte.push('Membro della band dal ' + u.Inizio + ': ' + u.Nome);
                  } else {
                    this.scritte.push('Membro della band: ' + u.Nome);
                  }
                }
              }
            });
            this.membriArtista.sort((a, b) => a.Inizio.localeCompare(b.Inizio));
          }

          // console.log(this.membriArtista);
          // console.log(this.dischiArtista);
          // console.log(this.urlsArtista);
          this.caricamentoInCorsoIA = false;
        } else {
          this.caricamentoInCorsoIA = false;
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.caricamentoInCorsoIA = false;
          console.log('Error nel caricamento delle info', error);
        }
      }
    );

  }

  controllaEsistenzaCookieBellezza() {
    return;
  }
  
  /* apriPlaylist() {
    this.mascheraBrani = true
  } */

  impostaBellezza() {
     // console.log('Prendo bellezza brano', this.numeroBrano);
    const bellezza2 = this.utility.ritornaStelleBrano(this, this.numeroBrano, true);
    // console.log('Prendo bellezza brano', this.numeroBrano, bellezza2);

    for (let i = 0; i < bellezza2; i++) {
      this.bellezza[i] = 'assets/immagini/preferito.png';
    }
    for (let i = bellezza2; i <= 10; i++) {
      this.bellezza[i] = 'assets/immagini/preferito_vuoto.png';
    }
  }

  spostamentoBarra(event: MatSliderChange) {
    this.accendeOpacita();

    // console.log("This is emitted as the thumb slides");

    this.utility.scriveDebug(this, 'Spostamento: ' + event.value);

    if (this.deviceGirante !== 'Android') {
      this.audio.currentTime = event.value;
    } else {
      // this.audioAndroid.pause();
      setTimeout(() => {
        this.audioAndroid.seekTo(event.value);
        this.posizioneBrano = event.value;
      }, 10);
    }
    this.posizioneBrano = event.value;
    this.tempoPassato = this.converteTempo(this.posizioneBrano);

    // console.log(event.value, this.audio.currentTime);

    if (this.videoNONCaricato === true) {
      if (this.videoplayer) {
        setTimeout(() => {
          this.videoplayer.seekTo(+this.posizioneBrano, true);
        }, 100);
      }
    } else {
      if (this.videoplayerLocale) {
        // this.videoplayerLocale.nativeElement.mute();
        setTimeout(() => {
          this.videoplayerLocale.nativeElement.currentTime = +this.posizioneBrano;
        }, 100);
      }
    }
  }

  startTimerScritte() {
    /* if (this.moadalitaLite) {
      return;
    } */
    
    if (this.intervalScritte) {
      clearInterval(this.intervalScritte);
    }
    this.intervalScritte = setInterval(() => {
      this.contaTimerScritte++;
      if (this.contaTimerScritte > 3) {
        this.contaTimerScritte = 0;
        this.qualeScritta++;
        // console.log(this.contaTimerScritte);
        if (this.scritte) {
          if (this.qualeScritta > this.scritte.length - 1) {
            this.qualeScritta = 0;
          }
        }
      }
    }, 1000);
  }

  converteTempo(e) {
    if (e) {
      let ee = e;
      let minuti = 0;
      let secondi = 0;
      while (ee > 59) {
        minuti++;
        ee -= 60;
      }
      secondi += ee;
      let min = minuti.toString().trim();
      if (min.length === 1) {
        min = '0' + min;
      }
      let sec = secondi.toString().trim();
      if (sec.indexOf('.') > - 1) {
        sec = sec.substring(0, sec.indexOf('.'));
      }
      if (sec.length === 1) {
        sec = '0' + sec;
      }
      if (sec === '-0') {
        sec = '00';
      }

      // console.log(minuti,secondi,min,sec);

      return min + ':' + sec;
    } else {
      return '00:00';
    }
  }

  startTimerAndroid() {
    this.utility.scriveDebug(this, 'Start Timer Android. Inizio');
    this.accendeOpacita();

    /* if (this.timerAndroid) {
      this.pauseTimer();
    } */
    this.scaricatoAutomaticamente = false;
    // this.utility.scriveDebug(this, 'Azzero prossimo brano 1');
    // this.caricatoProssimoBrano = -1;
    this.titoloBranoAutomatico = '';
    this.fFiles.operazioneSuFile = '';

    /* this.timerAndroid = workerTimers.setInterval(() => {
      this.funzionteTick();
    }, 1000); */
    // if (!this.classeTimer) {
      this.classeTimer = new ClasseTimer(this);
      this.classeTimer.parto();
    // }
  }

  /* startTimer() {
    this.utility.scriveDebug(this, 'Start Timer. Inizio');
    this.accendeOpacita();

    if (this.interval) {
      this.pauseTimer();
    }
    this.scaricatoAutomaticamente = false;
    this.caricatoProssimoBrano = -1;
    this.titoloBranoAutomatico = '';
    this.fFiles.operazioneSuFile = '';

    this.interval = setInterval(() => {
      this.funzionteTick();
    }, 1000);
  } */

  funzioneTick() {
    if (this.mascheraBrani) {
      this.accendeOpacita();
      this.contaTimerOpacity = 0;
    }
    // console.log(this.posizioneBrano);
    // this.utility.scriveDebug(this, 'Posizione brano: ' + this.posizioneBrano + ' Durata: ' + this.tempoTotaleBrano);

    // this.utility.scriveDebug(this, 'Tick1: ' + this.posizioneBrano);

    this.tempoPassato = this.converteTempo(this.posizioneBrano);
    // this.utility.scriveDebug(this, 'Tick2: ' + this.tempoPassato);

    if (this.deviceGirante !== 'Android') {
      this.posizioneBrano = this.audio.currentTime;

      if ((this.audio.ended || this.posizioneBrano > this.tempoTotaleBrano) && this.impostatoBranoFinito === false) {
        // clearInterval(this.interval);
        this.impostatoBranoFinito = true;
        this.utility.scriveDebug(this, 'Fine brano, carico il successivo');
        if (this.caricatoProssimoBrano > -1) {
          this.numeroBrano = this.caricatoProssimoBrano;
        } else {
          this.numeroBrano = this.prendeNumeroProssimoBrano(2);
        }
        this.numeroBranoAttuale = this.numeroBrano;      
        // console.log(this.numeroBrano);
        // return;

        if (this.numeroBrano > 0) {
          this.caricaBrano.caricaBrano(this);

          this.utility.scriveDebug(this, 'Fine brano, caricato il successivo: ' + this.numeroBrano);
        }
      }
    } else {
      // if (this.durata === -1) {
        if (this.audioAndroid) {
          this.audioAndroid.getCurrentPosition().then((curpos) => {
            this.posizioneBrano = curpos;
          });

          const dur = this.audioAndroid.getDuration();
          // this.utility.scriveDebug(this, 'Tick. Durata: ' + dur + ' - ' + this.durata);
          if (dur > 0 && dur > this.durata) {
            // setTimeout(() => {
              this.durata = dur;
              this.utility.scriveDebug(this, 'Arrivata durata brano:' + this.durata);
              this.tempoTotaleBrano = this.durata;
              this.tempoTotale = this.converteTempo(this.durata);
              // this.utility.scriveDebug(this, 'Conversione durata brano:' + this.tempoTotale);
            // }, 2000);
          }
        }
      // }
      
      if (this.durata > 1) {
        if (this.posizioneBrano > 15 && this.tempoTotaleBrano > 75 && !this.scaricatoAutomaticamente && this.posizioneBrano < 25) {
          this.utility.scriveDebug(this, 'Start timer. Prendo prossimo brano in automatico');
          // Prende prossimo brano
          this.gestAndroid.scaricaProssimoBranoInAutomatico(this);
        }
  
        // if (this.posizioneBrano > this.tempoTotaleBrano && this.impostatoBranoFinito === false) {
        if (this.branoTerminato === true) {
            // clearInterval(this.interval);
          this.impostatoBranoFinito = true;
          this.utility.scriveDebug(this, 'Fine brano, carico il successivo');
          if (this.caricatoProssimoBrano > -1) {
            this.numeroBrano = this.caricatoProssimoBrano;
          } else {
            this.numeroBrano = this.prendeNumeroProssimoBrano(2);
          }
          this.numeroBranoAttuale = this.numeroBrano;      
          // console.log(this.numeroBrano);
          // return;

          if (this.numeroBrano > 0) {
            this.caricaBrano.caricaBrano(this);

            this.utility.scriveDebug(this, 'Fine brano, caricato il successivo: ' + this.numeroBrano);
          }
        }
      }
      // this.utility.scriveDebug(this, 'Tick. Uscita');
    }

    this.contaTimerOpacity++;
    if (this.contaTimerOpacity === 5) {
      this.opacita = .05;
    }

    this.contaTimer++;
    if (this.contaTimer > 15) {
      this.contaTimer = 0;
      this.startTimerImmagine();
      // console.log(this.immagineSfondo);
    }
  }

  startTimerImmagine() {
    this.utility.scriveDebug(this, 'Cambio immagine. Modalita You Tube: ' + this.modalitaYouTube);

    /* if (this.moadalitaLite === true) {
      this.utility.scriveDebug(this, 'Esco per Moadlita Lite');
      return;
    } */

    if (this.modalitaYouTube === 'S') {
      this.utility.scriveDebug(this, 'Esco per Moadlita You Tube');
      return;
    }

    this.utility.scriveDebug(this, 'Start timer immagine');
    if (this.intervalImmagine) {
      clearInterval(this.intervalImmagine);
    }
    if (this.cicla === true || (this.cicla === false && this.staSuonando)) {
      this.intervalImmagine = setInterval(() => {
        clearInterval(this.intervalImmagine);
        if (this.modalitaYouTube === 'S') {
          return;
        }
    
        if (this.sfuma) {
          this.cambiaImmagine1();
        } else {
          this.cambiaImmagine2();
        }
      }, 15000)
    }
  }

  cambiaImmagine1() {
    if (this.modalitaYouTube === 'S') {
      return;
    }

    // console.log('Cambia immagine 1');
    if (this.timerInterval1) {
      clearInterval(this.timerInterval1);
    }
    this.timerInterval1 = setInterval(() => {
      // console.log(this.opacitaImmagine1, this.opacitaImmagine2);

      this.opacitaImmagine1 -= .05;
      this.opacitaImmagine2 -= .05;

      if (+this.opacitaImmagine1 < 0) {
        this.opacitaImmagine1 = 0;
      }
      if (+this.opacitaImmagine2 < 0) {
        this.opacitaImmagine1 = 0;
        this.opacitaImmagine2 = 0;

        clearInterval(this.timerInterval1);

        this.utility.scriveDebug(this, 'Cambio immagine');
        this.cambiaImmagine2();
      }
    }, 150);
  }

  prendeImmagine() {
    this.contaTimer = 0;
    const r = Math.floor(Math.random() * (this.quanteImmagini - this.inizioImmagini + 1) + this.inizioImmagini);
    console.log('PRENDE IMMAGINE', r, this.quanteImmagini, this.inizioImmagini);

    if (this.immagini && this.immagini[r]) {
      if (this.immagini[r].immagine.indexOf('.gif') === -1) {
        this.appoSfondo = this.apiService.ritornaUrlImmagine() + 'ImmaginiMusica/' + this.artista + '/' +
          this.immagini[r].cartella + '/' + this.immagini[r].immagine;
      } else {
        this.appoSfondo = this.apiService.ritornaUrlImmagine() + 'GifsMusica/' + this.artista + '/' + this.immagini[r].immagine;
      }
    }
    this.immaginiCambiate++;
    if (this.immaginiCambiate > 5) {
      this.immaginiCambiate = 0;
      this.scaricaNuovaImmagine();
    }
    // console.log('Cambio immagine', this.appoSfondo, this.immaginiCambiate);
  }

  cambiaImmagine2() {
    if (this.timerInterval2) {
      clearInterval(this.timerInterval2);
    }
    if (this.modalitaYouTube === 'S') {
      return;
    }

    let conta = 0;
    this.finitoAttesa = false;
    this.erroreImmagine = false;

    this.timerInterval2 = setInterval(() => {
      if (this.finitoAttesa === true) {
        this.utility.scriveDebug(this, 'Fine attesa immagine: ' + conta);
        if (this.erroreImmagine === true) {
          conta++;
          if (+conta < 5) {
            // console.log('Riprovo dopo Fine attesa 2', conta);
            this.finitoAttesa = false;
            this.erroreImmagine = false;
            this.controllaImmagineSeEsiste();          
          } else {
            clearInterval(this.timerInterval2);
            this.appoSfondo = 'assets/immagini/looWPIcon.png';
            setTimeout(() => {
              this.immagineSfondo = this.appoSfondo;

              this.utility.scriveDebug(this, 'Immagine sfondo: ' + this.immagineSfondo);
                            
              if (this.deviceGirante === 'Android') {
                const b = this.appoSfondo.split('/');

                this.file.writeFile(this, 3, 'LooigiSoft', 'looWebPlayer/Immagini/' + this.artista + '/' +
                  this.album + '/' + b[b.length - 1], this.immagineSfondo).then((Ritorno) => {
                });
              }

              this.cambiaImmagine3();
            }, 100);
          }
        } else {
          clearInterval(this.timerInterval2);
        }
      }
    }, 0, 1000)

    this.controllaImmagineSeEsiste();
  }

  controllaImmagineSeEsiste() {
    if (!this.isConnected) {
      return;
    }

    this.prendeImmagine();

    let imm = this.appoSfondo;
    imm = imm.replace(this.urlImmagine, '');
    imm = imm.replace('Immagini/', '');
    this.utility.scriveDebug(this, 'Controllo immagine se esiste: ' + imm);

    this.apiService.esisteImm(
      imm
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log('Controllo immagine se esiste. Ritorno: ', data2);
          this.finitoAttesa = true;
          if (data2.indexOf('ERROR:') === -1) {
            setTimeout(() => {
              this.appoSfondo = data2;
              this.immagineSfondo = this.appoSfondo;

              this.utility.scriveDebug(this, 'Immagine sfondo dopo controllo: ' + this.immagineSfondo);
                            
              /* 
              QUI PER SALVARE TUTTE LE IMMAGINI CHE GIRANO
              if (this.deviceGirante === 'Android') {
                const b = this.appoSfondo.split('/');

                this.utility.scriveImmagineSeNonEsiste(this, this.artista, this.album, b[b.length - 1], this.immagineSfondo);
              } */

              // this.cambiaImmagine3();
            }, 100);
          } else {
            this.erroreImmagine = true;
            // alert(data2);
            // this.utility.visualizzaMessaggio(this, 'Controllo immagine: ' + data2, true);
          }
        }
      },
      (error) => {
        this.erroreImmagine = true;
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Controllo Immagine: ' + error.message, true);
        }
      }
    );
  }

  cambiaImmagine3() {
    const t = setInterval(() => {
      // console.log(this.opacitaImmagine1, this.opacitaImmagine2);

      this.opacitaImmagine1 += .05;
      this.opacitaImmagine2 += .05;

      if (+this.opacitaImmagine1 > 1) {
        this.opacitaImmagine1 = 1;
      }
      if (+this.opacitaImmagine2 > .85) {
        this.opacitaImmagine1 = .65;
        this.opacitaImmagine2 = .85;

        clearInterval(t);

        this.startTimerImmagine();
      }
    }, 150);
  }

  pauseTimer() {
    // if (this.deviceGirante === 'Android') {
      if (this.classeTimer) {
        // this.timerAndroid = undefined;
        // workerTimers.clearInterval(this.timerAndroid);
        this.classeTimer.stoppaTimer();
        this.classeTimer = undefined;
      }
    /* } else {
      if (this.interval) {
        clearInterval(this.interval);
      }
    } */
  }

  getUrl() {
    if (this.immagineSfondo && this.immagineSfondo !== '') {
      // console.log('url(\'' + this.immagineSfondo.replace('\'', '%27').replace(' ', '%20') + '\')');
      return 'url(\'' + this.immagineSfondo.replace('\'', '%27').replace(' ', '%20') + '\')';
    } else {
      return null;
    }
  }

  play(s) {
    this.utility.scriveDebug(this, 'Premuto play: ' + s);

    this.accendeOpacita();

    if (s === false) {
      this.staSuonando = false;
      if (this.deviceGirante !== 'Android') {
        if (this.audio) {
          this.audio.pause();
        }
      } else {
        if (this.audioAndroid) {
          this.audioAndroid.pause();
        }
      }

      if (this.videoNONCaricato === true) {
        if (this.videoplayer) {
          this.videoplayer.pauseVideo();
        }
      } else {
        if (this.videoplayerLocale) {
          // this.videoplayerLocale.nativeElement.mute();
          this.videoplayerLocale.nativeElement.pause();
        }
      }

      this.pauseTimer();
      
      if (this.cicla === false) {
        clearInterval(this.intervalImmagine);
      }
    } else {
      this.staSuonando = true;
      if (this.deviceGirante !== 'Android') {
        if (this.audio) {
          if (!this.staCaricandoVideo) {
            this.audio.play();
          }
        }
      } else {
        if (this.audioAndroid) {
          if (!this.staCaricandoVideo) {
            this.audioAndroid.play();
          }
        }
      }

      if (this.videoNONCaricato === true) {
        if (this.videoplayer) {
          this.videoplayer.playVideo();
        }
      } else {
        if (this.videoplayerLocale) {
          // this.videoplayerLocale.nativeElement.mute();
          this.videoplayerLocale.nativeElement.play();
        }
      }

      this.pauseTimer();

      if (this.modalitaYouTube === 'N') {
        if (this.deviceGirante === 'Android') {
          this.startTimerAndroid();
        } else {
          // this.startTimer();
          this.startTimerAndroid();
        }
      }

      // if (this.cicla === false) {
        this.startTimerImmagine();
      // }
    }
  }

  indietroBrano() {
    this.utility.scriveDebug(this, 'Indietro brano.');
    if (ComponentFile.staScaricandoFile === true) {
      this.utility.scriveDebug(this, 'Indietro brano, download in corso. Lo interrompo.');
      ComponentFile.interrompiDownload = true;
    }

    this.accendeOpacita();

    // if (this.interval) {
    //   clearInterval(this.interval);
    // }
    this.pauseTimer();

    this.impostatoBranoFinito = false;

    this.staCaricandoVideo = true;
    if (this.videoNONCaricato === true) {
      try {
        this.videoplayer.stopVideo();
      } catch (e) {

      }
    } else {
      try {
        // this.videoplayerLocale.nativeElement.mute();
        this.videoplayerLocale.nativeElement.stop();
      } catch (e) {

      }
    }

    if (this.ascoltata > 0) {
      this.ascoltata--;
      // console.log('Indietro', this.ascoltati, this.ascoltati[this.ascoltata]);

      let brano = undefined;
      this.braniFiltrati.forEach(element => {
        if (!brano) {
          element.children.forEach(element2 => {
            if (!brano) {
              element2.children.forEach(element3 => {
                if (!brano) {
                  if (+element3.id === +this.ascoltati[this.ascoltata]) {
                    brano = element3;
                  }
                }
              });
            }
          });
        }
      });
        
      this.numeroBrano = brano.id; //  this.ascoltati[this.ascoltata];
      this.numeroBranoAttuale = brano.id;
      // console.log(this.numeroBrano, this.ascoltati[this.ascoltata]);
      if (this.deviceGirante !== 'Android') {
        this.audio.pause();
      } else {
        this.audioAndroid.pause();
      }
      this.caricaBrano.caricaBrano(this);
    }
  }

  accendeOpacita() {
    if (this.modalitaYouTube === 'N') {
      this.opacita = .95;
      this.contaTimerOpacity = 0;
    }
  }

  avantiBrano() {
    this.utility.scriveDebug(this, 'Avanti brano, carico il successivo. Brani filtrati: ' + this.braniFiltrati.length + ' - Dati JSON: ' + this.datiJSON.length);

    if (!this.braniFiltrati || !this.datiJSON) {
      return;
    }

    /* if (this.interval) {
      clearInterval(this.interval);
    } */
    this.pauseTimer();
    
    if (this.intervalDurata) {
      clearInterval(this.intervalDurata);
    }

    this.impostatoBranoFinito = false;

    if (ComponentFile.staScaricandoFile === true) {
      this.utility.scriveDebug(this, 'Avanti brano, download in corso. Lo interrompo.');
      ComponentFile.interrompiDownload = true;
    }

    this.accendeOpacita();

    // console.log(this.ascoltata, this.ascoltate, this.ascoltati);
    this.staCaricandoVideo = true;
    if (this.videoNONCaricato === true) {
      try {
        this.videoplayer.stopVideo();
      } catch (e) {

      }
    } else {
      try {
        // this.videoplayerLocale.nativeElement.mute();
        this.videoplayerLocale.nativeElement.stop();
      } catch (e) {

      }
    }

    this.utility.scriveDebug(this, 'Avanti brano, ascoltata ' + this.ascoltata + '/' + this.ascoltate);
    if (this.ascoltata <= this.ascoltate) {
      this.ascoltata++;
      this.numeroBrano = this.ascoltati[this.ascoltata];
      this.numeroBranoAttuale = this.numeroBrano;
      this.utility.scriveDebug(this, 'Avanti brano, prendo vecchio: ' + this.numeroBrano);
      if (this.deviceGirante !== 'Android') {
        if (this.audio) {
          this.audio.pause();
        }
      } else {

      }
      this.caricaBrano.caricaBrano(this);
    } else {
      this.ascoltata++;
      if (this.deviceGirante !== 'Android') {
        if (this.audio) {
          this.audio.pause();
        }
      } else {
        if (this.audioAndroid) {
          this.audioAndroid.pause();
        }
      }

      this.utility.scriveDebug(this, 'Avanti brano, cerco nuovo');
      this.utility.scriveDebug(this, 'Avanti brano, brano caricato automaticamente: ' + this.caricatoProssimoBrano);
      if (this.caricatoProssimoBrano > -1) {
        this.numeroBrano = this.caricatoProssimoBrano;
      } else {
        this.numeroBrano = this.prendeNumeroProssimoBrano(1);
      }
      this.numeroBranoAttuale = this.numeroBrano;
      this.utility.scriveDebug(this, 'Avanti brano, prendo nuovo: ' + this.numeroBrano);
      if (this.numeroBrano === -1) {
        this.utility.scriveDebug(this, 'Avanti brano. Ritornato -1. Ricarico un altro');
        setTimeout(() => {
          this.avantiBrano();
        }, 100);
        return;
      }
      this.ascoltati.push(this.numeroBrano);
      // console.log(this.numeroBrano);
      /* let q = 0;
      while(this.numeroBrano === -1 && q !== -1) {
        this.numeroBrano = this.prendeNumeroProssimoBrano(3);
        // console.log(this.numeroBrano);
        q++;
        if (q === 100) {
          q = -1;
          console.log('----------------------------------');
          console.log('ERRORE SU RILEVAMENTO BRANI');
          console.log('Quanti Brani Selezionati: ', this.ultimoFiltroArray.length);
          console.log('Brani: ', this.datiJSON);
          console.log('----------------------------------');
          alert('Problemi con la rilevazione del nuovo brano. Guardare la console');
        }
      } */

      // console.log(this.numeroBrano);
      // return;

      this.caricaBrano.caricaBrano(this);

      this.utility.scriveDebug(this, 'Avanti brano. Caricato');
    }

    // console.log('Avanti brano. Imposto bellezza');
    // return;

    this.impostaBellezza();

    // console.log(this.ascoltati, this.ascoltata);
  }

  prendeNumeroProssimoBrano(daDove) {
    if (!this.braniFiltrati) {
      alert('Nessun brano in archivio');
      return;
    }
    // this.debuggone = '';
    let random: number = -1;
    let q = 0;
    let brano = undefined;

    // console.log(this.braniFiltrati);
    // const quantiBraniSelezionati = this.braniFiltrati.length;
    this.utility.scriveDebug(this, 'Modalità Random: ' + this.random);

    // if (!this.quantiBraniFiltrati || this.quantiBraniFiltrati === 0) {
    //   this.quantiBraniFiltrati = this.braniFiltrati.length;
    // }
    let tentativi = 0;
    let esce = false;

    while ((!brano || !brano.id || brano.id === '') && esce === false) {
      if (this.random === 'S') {
        this.utility.scriveDebug(this, 'Inizio Random: ' + random);
        this.utility.scriveDebug(this, 'Già preso: ' + this.braniFiltrati[random]);
        this.utility.scriveDebug(this, 'Quanti brani filtrati: ' + this.quantiBraniFiltrati);
        // while (random === -1 || this.braniFiltrati[random] === '' || !this.braniFiltrati[random]) {
        while (random === -1) {
          random = Math.floor(Math.random() * (this.quantiBraniFiltrati - 1 + 1)) + 1;
          this.utility.scriveDebug(this, 'Testo Random: ' + random);
        }
        this.utility.scriveDebug(this, 'Fine Random: ' + random);
      } else {
        random = this.numeroBrano + 1;
        if (random > this.quantiBraniFiltrati - 1) {
          random = 1;
        }
      }
      // const id = this.braniFiltrati[random];

      this.utility.scriveDebug(this, 'Brani filtrati: ' + this.quantiBraniFiltrati);
      this.utility.scriveDebug(this, 'Random: ' + random);
      
      if (this.braniFiltrati) {
        this.braniFiltrati.forEach(element => {
          if (!brano) {
            element.children.forEach(element2 => {
              if (!brano) {
                element2.children.forEach(element3 => {
                  if (!brano) {
                    q++;
                    if (q === random) {
                      brano = element3;
                      this.pathBranoProssimo = element3.path;
                      this.branoPresenteSuSD = element3.locale;
                    }
                  }
                });
              }
            });
          }
        });
      }

      if (this.deviceGirante === 'Android' && this.isConnected === false && this.branoPresenteSuSD === false) {
        brano = undefined;
        this.utility.scriveDebug(this, 'Assenza di connessione, dispositivo Android e brano non su SD. Riprovo');
      } else {
        if (!brano.id || brano.id === '') {
          this.utility.scriveDebug(this, 'Nessuna informazione sul brano. Riprovo a cercarne un altro');
          tentativi++;
          if (tentativi > 10) {
            alert('Troppi tentativi nel rilevare il numero del brano');
            esce = true;
          }
        } else {
          this.utility.scriveDebug(this, 'Brano rilevato con id ' + random  + ': ' + JSON.stringify(brano));
          this.utility.scriveDebug(this, 'ID Brano rilevato: ' + brano.id);
          this.utility.scriveDebug(this, 'Brano rilevato: ' + brano.text);
          this.utility.scriveDebug(this, 'Path brano: ' + this.pathBranoProssimo);    
        }
      }
    }
    
    if (this.deviceGirante === 'Android' && this.branoPresenteSuSD && brano.text && brano.text !== '') {
      ComponentFile.filesInMemoria.forEach(element => {
        if (element.toUpperCase().indexOf(brano.text.toUpperCase().trim()) > -1) {
          this.branoPresenteSuSD = true;
        }
      });
    }

    // this.utility.scriveDebug(this, 'Azzero prossimo brano 2');
    // this.caricatoProssimoBrano = -1;
    
    this.utility.scriveDebug(this, 'Brano su SD: ' + this.branoPresenteSuSD);

    if (brano && brano.id) {
      return brano.id;
    } else {
      return -1;
    }
  }

  cambioSelezioneTV(e) {
    if (this.nonSalvareFiltro === true) {
      return;
    }

    this.braniFiltrati = ',' + e.toString() + ',';
    // console.log('Cambio selezione', e)
    // this.ultimoFiltroArray = this.braniFiltrati.split(',');
    // console.log(this.ultimoFiltroArray);
    this.contaTimerSalvataggio = 0;
    this.accendeTimerSalvataggio();
  }

  cambioFiltroTV(e) {
    // console.log(e);
    // console.log(this.itemsCanzoniFiltrate);
  }

  accendeTimerSalvataggio() {
    if (this.intervalSalvataggio) {
      clearInterval(this.intervalSalvataggio);
    }
    this.intervalSalvataggio = setInterval(() => {
      this.contaTimerSalvataggio++;
      if (this.contaTimerSalvataggio === 2) {
        this.contaTimerSalvataggio = 0;
        clearInterval(this.intervalSalvataggio);

        // localStorage.setItem('Dati_' + this.letteraItem, this.ultimoFiltro);
        // console.log('Filtro salvato');
      }
    }, 1000);
  }

  sistemaTesto(testo) {
    let t = '';
    if (testo) {
      t = testo;
      while (t.indexOf('***PV***') > -1) {
        t = t.replace('***PV***', ';');
      }
      while (t.indexOf('§') > -1) {
        t = t.replace('§', '<br />');
      }
      while (t.indexOf('%20') > -1) {
        t = t.replace('%20', ' ');
      }
    }

    return t;
  }

  refreshCanzoni() {
    if (!this.isConnected) {
      return;
    }

    if (confirm('Si vogliono ricaricare i dati delle canzoni ?')) {
      this.refreshCanzoniSenzaDomanda();
    }
  }

  refreshCanzoniSenzaDomanda() {
    if (!this.isConnected) {
      return;
    }

    this.caricamentoInCorso = true;
    this.apiService.refreshDB(
      this.idUtenza
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          this.caricamentoInCorso = false;
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.utility.visualizzaMessaggio(this, 'Refresh Brani: Dati ricaricati', false);
            // localStorage.removeItem('bellezzeJSON');
            // // this.caricaTutto();
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Refresh brani: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Refresh Brani: ' + error.message, true);
        }
      }
    );
  }

  refreshCanzoniHARD(chiedeConferma) {
    if (!this.isConnected) {
      return;
    }

    if (!chiedeConferma) {
      this.refreshCanzoniSenzaDomandaHard();
    } else {
      if (confirm('Si vogliono ricaricare COMPLETAMENTE i dati delle canzoni ?\nL\'operazione sarà molto lunga')) {
        this.refreshCanzoniSenzaDomandaHard();
      }
    }
  }

  refreshCanzoniSenzaDomandaHard() {
    if (!this.isConnected) {
      return;
    }

    this.caricamentoInCorso = true;
    this.apiService.refreshDBHard(
      this.idUtenza
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          this.caricamentoInCorso = false;
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.utility.visualizzaMessaggio(this, 'Refresh Brani: Dati ricaricati', false);
            // localStorage.removeItem('bellezzeJSON');
            // // this.caricaTutto();
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Refresh brani: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Refresh Brani: ' + error.message, true);
        }
      }
    );
  }

  effettuaReplace(str, find, replace) {
    const escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  tuttoSchermo() {
    if (this.bTuttoSchermo) {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
      this.bTuttoSchermo = false;
    } else {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      this.bTuttoSchermo = true;
    }
  }

  settaStelle(n) {
    if (!this.isConnected) {
      return;
    }

    // titoloBrano = '';
    // artista = '';
    // album = '';

    const params = {
      idCanzone: this.numeroBrano,
      Stelle: n
    };

    this.utility.scriveDebug(this, 'Setta stelle: ' + JSON.stringify(params));

    this.apiService.impostaStelle(
      this.idUtenza,
      params
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          this.utility.scriveDebug(this, 'Setta stelle. Ritorno: ' + data2);
          if (data2.indexOf('ERROR:') === -1) {
            for (let i = 0; i < n; i++) {
              this.bellezza[i] = 'assets/immagini/preferito.png';
            }
            for (let i = n; i <= 10; i++) {
              this.bellezza[i] = 'assets/immagini/preferito_vuoto.png';
            }
            this.utility.visualizzaMessaggio(this, 'Stelle impostate: ' + n, false);

            this.datiJSON.forEach(element => {
              element.children.forEach(element2 => {
                element2.children.forEach(element3 => {
                  if (element3.id === this.numeroBrano) {
                    element3.Stelle = n;
                  }
                });
              });
            });

            this.storage.checkTutteLeCanzoni(this);
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Imposta Stelle: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Imposta Stelle: ' + error.message, true);
        }
      }
    );
  }

  clickSuTreeView(e) {
    this.caricatoProssimoBrano = -1;
    const brano = e.srcElement.innerText;
    // console.log(brano);
    setTimeout(() => {
      this.nonSalvareFiltro = false;
    }, 100);
  }

  cambiaFiltro(e) {
    if (e.length > 1) {
      this.listaFiltrata = new Array();
      this.hover = new Array();
      this.datiJSON.forEach(element => {
        if (
          element.Album.toUpperCase().indexOf(e.toUpperCase()) > -1 ||
          element.Artista.toUpperCase().indexOf(e.toUpperCase()) > -1 ||
          element.Brano.toUpperCase().indexOf(e.toUpperCase()) > -1
        ) {
          this.listaFiltrata.push(element);
          this.hover.push(false);
        }
      });
      // console.log('Filtro:',this.listaFiltrata);
    }
  }

  selezioneBranoFiltrato(b) {
    // console.log(b);
    this.numeroBrano = b.Id;
    this.numeroBranoAttuale = this.numeroBrano;

    if (this.deviceGirante !== 'Android') {
      if (this.audio) {
        this.audio.pause();
      }
    } else {
      if (this.audioAndroid) {
        this.audioAndroid.pause();
      }
    }

    this.caricaBrano.caricaBrano(this);
  }

  eliminaImmagine() {
    if (!this.isConnected) {
      return;
    }

    if (this.immagineSfondo === '') {
      alert('Nessuna immagine presente');
      return;
    }
    let imm = this.immagineSfondo;
    imm = imm.replace(this.urlWS, '');
    imm = imm.replace('Brani/', '');

    if (this.debug === true) {
      console.log(imm);
    }
    this.apiService.eliminaImm(
      imm
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.cambiaImmagine1();
            // alert('Immagine eliminata');
            this.utility.visualizzaMessaggio(this, 'Immagine eliminata', false);
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Elimina immagine: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Elimina immagine: ' + error.message, true);
        }
      }
    );
  }

  scaricaFileEliminazioni() {
    if (!this.isConnected) {
      return;
    }

    const nomeFile = this.urlWS + 'Eliminazioni.txt';
    // console.log(nomeFile);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", nomeFile, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = 'Eliminazioni.txt';
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();    
  }

  scaricaImmagine() {
    if (!this.isConnected) {
      return;
    }

    let imm = this.immagineSfondo;
    imm = imm.replace(this.urlWS, '');
    imm = imm.replace('Brani/', '');
    const imm2 = imm.split('/');
    const nomeFile = imm2[imm2.length - 1];
    console.log(imm);

    this.apiService.controllaSeGiaScaricata(
      imm
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.immagineSfondo, true);
            xhr.responseType = "blob";
            xhr.onload = function(){
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(this.response);
                var tag = document.createElement('a');
                tag.href = imageUrl;
                tag.download = 'looWebPlayer_' + nomeFile;
                document.body.appendChild(tag);
                tag.click();
                document.body.removeChild(tag);
            }
            xhr.send();    
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Controllo immagine: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Controllo immagine: ' + error.message, true);
        }
      }
    );
  }

  settaLinguaggio() {
    // console.log(this.linguaggio);
    if (this.linguaggio === 'OR') {
      this.linguaggio = 'IT';
      this.linguaggioIcona = 'assets/immagini/italiano.png'
    } else {
      this.linguaggio = 'OR';
      this.linguaggioIcona = 'assets/immagini/inglese.png'
    }
    localStorage.setItem('linguaggio', this.linguaggio);
  }

  eliminaVideo() {
    if (!this.isConnected) {
      return;
    }

    const vid = this.youTubeVideos[this.numeroVideo].pathUrl;

    if (this.debug === true) {
      console.log(vid);
    }
    this.apiService.eliminaVideo(
      vid
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.youTubeVideos[this.numeroVideo].Esiste = 'N';
            this.ytComponent.avanzaVideo(this);
            // alert('Immagine eliminata');
            this.utility.visualizzaMessaggio(this, 'Video eliminato', false);
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, 'Elimina Video: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Elimina Video: ' + error.message, true);
        }
      }
    );
  }

  downloadVideo() {
    if (!this.isConnected) {
      return;
    }

    const prima = this.youTubeVideos[this.numeroVideo].linkVideo.substring(0, 1);
    const videoSource = this.urlWS + 'YouTube/' + prima + '/' + this.youTubeVideos[this.numeroVideo].linkVideo +
      this.youTubeVideos[this.numeroVideo].estensione;
    console.log('Download ', videoSource);
    const FileSaver = require('file-saver');
    FileSaver.saveAs(videoSource, this.youTubeVideos[this.numeroVideo].linkVideo +
      this.youTubeVideos[this.numeroVideo].estensione);
  }

  scaricaVideoPregressi() {
    if (!this.isConnected) {
      return;
    }

    this.apiService.scaricaVideoPregressi(
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.utility.visualizzaMessaggio(this, data2, false);
          } else {
            // alert(data2);
            this.utility.visualizzaMessaggio(this, data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Scarica Video: ' + error.message, true);
        }
      }
    );
  }

  scriveVolteAscoltata() {
    if (!this.isConnected) {
      return;
    }

    this.apiService.scriveVolteAscoltata(
      this.idUtenza,
      this.numeroBrano
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.ritornaVolteAscoltata()
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Setta volte ascoltata: ' + error.message, true);
        }
      }
    );
  }

  ritornaVolteAscoltata() {
    if (!this.isConnected) {
      return;
    }

    this.apiService.ritornaVolteAscoltata(
      this.idUtenza,
      this.numeroBrano
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.volteAscoltatoBrano = data2;
          } else {
            this.volteAscoltatoBrano = 0;
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.volteAscoltatoBrano = 0;
          this.utility.visualizzaMessaggio(this, 'Ritorna volte ascoltata: ' + error.message, true);
        }
      }
    );
  }

  scaricaNuovaImmagine() {
    if (!this.isConnected) {
      return;
    }

    // console.log('Scaricando nuova immagine', this.artista);
    if (!this.staSuonando) {
      return;
    }

    this.apiService.ScaricaNuovaImmagine(
      { 
        Artista: this.artista,
        Album: '',
        Canzone: ''
      }
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          console.log('Scarica nuova immagine', data2);
          if (data2.indexOf('ERROR:') === -1) {
          } else {
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
        }
      }
    );
  }

  scaricaTesto() {
    if (!this.isConnected) {
      return;
    }

    this.apiService.ScaricaTesto(
      { 
        idCanzone: this.numeroBrano,
        Artista: this.artista,
        Album: this.album,
        Canzone: this.titoloBranoPerTesto
      }
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
            const d = data2.split('|');
            this.testo = this.sistemaTesto(d[0]);
            this.testoTradotto = this.sistemaTesto(d[1]);

            console.log(this.testo);
            if (this.testo.indexOf('Nessun testo rilevato') > -1) {
              this.Happi.prendeArtista(this, this.numeroBrano, this.artista, this.album, this.titoloBrano);
            }
          } else {
            this.volteAscoltatoBrano = 0;
            this.utility.visualizzaMessaggio(this, 'Ritorna scarica testo: ' + data2, true);

            this.Happi.prendeArtista(this, this.numeroBrano, this.artista, this.album, this.titoloBrano);
          }
        }
      },
      (error) => {
        this.volteAscoltatoBrano = 0;
        this.Happi.prendeArtista(this, this.numeroBrano, this.artista, this.album, this.titoloBrano);
        this.utility.visualizzaMessaggio(this, 'Ritorna scarica testo: ' + error.message, true);
      }
    );
  }

  eliminaBrutte() {
    if (!this.isConnected) {
      return;
    }

    if (!confirm('Si voglio eliminare le canzoni di bellezza < 4 ?')) {
      return;
    }
    this.apiService.EliminaBrutte(
      this.idUtenza
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          console.log(data2);
          if (data2.indexOf('ERROR:') === -1) {
          } else {
            this.utility.visualizzaMessaggio(this, 'Ritorna scarica testo: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Ritorna scarica testo: ' + error.message, true);
        }
      }
    );
  }

  gestioneUguali() {
    if (!this.isConnected) {
      return;
    }

    this.apiService.RitornaUguali(
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            // console.log(data2);
            if (data2.indexOf('ERROR:') === -1) {
              this.uguali = new Array();
              const d = data2.split('§');
              d.forEach(element => {
                if (element) {
                  const dd = element.split(';');
                  const ddd = {
                    Artista: dd[0],
                    Brano: dd[1],
                    Quante: dd[2]
                  };
                  this.uguali.push(ddd);
                }
              });
              this.pannelloUtility = false;
              this.mascheraGestioneUguali = true;

              setTimeout(() => {
                this.settaZIndex(9);
              }, 100);          
            } else {
              this.utility.visualizzaMessaggio(this, 'Ritorna uguali: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Ritorna uguali: ' + error.message, true);
          }
        }
    );
  }

  visualizzaUguali(b) {
    if (!this.isConnected) {
      return;
    }

    this.ugualiSelezionato = b;
    // console.log(b);
    this.apiService.RitornaUgualiDettaglio(
      this.idUtenza, 
      {
          Artista: b.Artista,
          Brano: b.Brano
      }
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log('Ritorno uguali dettaglio: ', data2);
          if (data2.indexOf('ERROR:') === -1) {
            const uguali = new Array();
            const d = data2;
            const dd = d.split('§');
            dd.forEach(element => {      
              if (element) {
                const ddd = element.split(';')
                const dddd = {
                  Id: ddd[0],
                  Artista: b.Artista,
                  Brano: b.Brano,
                  Album: ddd[1],
                  Bellezza: ddd[2],
                  Traccia: ddd[3],
                  Anno: ddd[4],
                  Ascoltata: ddd[5]
                };
                uguali.push(dddd);
              }
            });
            this.ugualiDettaglio = uguali;
          } else {
            this.utility.visualizzaMessaggio(this, 'Ritorno uguali dettaglio: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Ritorno uguali dettaglio: ' + error.message, true);
        }
      }
    );          
  }

  braniAlbum(b) {
    if (!this.isConnected) {
      return;
    }

    this.albumSelezionato = b;
    // console.log(b);
    this.apiService.RitornaImmaginiArtista(
      b.artista
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            // console.log(data2);
            if (data2.indexOf('ERROR:') === -1) {
              this.immaginiArtista = new Array();
              const d = data2.split('§');
              d.forEach(element => {
                if (element) {
                  const dd = element.split(';');
                  const ddd = {
                    Artista: dd[0],
                    Cartella: dd[1],
                    Immagine: dd[2]
                  };
                  this.immaginiArtista.push(ddd);
                }
              });
              // console.log(this.immaginiArtista);
            } else {
              this.utility.visualizzaMessaggio(this, 'Ritorna immagini artista: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Ritorna immagini artista: ' + error.message, true);
          }
        }
    );
  }

  eliminaBranoUguali(b) {
    if (!this.isConnected) {
      return;
    }

    console.log(b);
    if (confirm('Si vuole eliminare il brano ?')) {
      this.apiService.EliminaBrano(
        this.idUtenza,
        { 
          Artista: b.Artista, Album: b.Album, Brano: b.Brano 
        }
        ).map(response => this.apiService.controllaRitorno(response))
        .subscribe(
          data => {
            if (data) {
              const data2 = this.apiService.prendeSoloDatiValidi(data);
              // console.log(data2);
              if (data2.indexOf('ERROR:') === -1) {
                this.gestioneUguali();
                this.visualizzaUguali(this.ugualiSelezionato);
                this.utility.visualizzaMessaggio(this, 'Brano eliminato', true);
              } else {
                this.utility.visualizzaMessaggio(this, 'Eliminazione brano: ' + data2, true);
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
              this.utility.visualizzaMessaggio(this, 'Eliminazione brano: ' + error.message, true);
            }
          }
      );    
    }
  }

  goToLink(url: string){
    if (!this.isConnected) {
      return;
    }

    window.open(url, "_blank");
  }  

  ricaricaBraniLocali() {
    const indice = 8;
    // ComponentFile.staLeggendoFiles[indice] = true;
    setTimeout(() => {
      this.file.prendeTuttiIFilesInLocale(this, 5).then((Ritorno) => {
        alert('Brani ricaricati');
        window.location.reload();
      });

      /* const si2 = setInterval(() => {
        if (!ComponentFile.staLeggendoFiles[indice]) {
          clearInterval(si2);
          alert('Brani ricaricati');
          window.location.reload();
        }
      }, 1000); */
    }, 100);
  }

  apreMenu() {
    this.menuMostrato = !this.menuMostrato;
    if (this.menuMostrato === true) {
      // console.log('Apro pannello menù');
      setTimeout(() => {
        this.settaZIndex(5);
      }, 100);
    }
  }

  caricaBranoConClick(e) {
    this.utility.scriveDebug(this, 'Brano clickato: ' + e);
    this.numeroBrano = e;
    this.numeroBranoAttuale = e;
    setTimeout(() => {
      this.caricaBrano.caricaBrano(this);
    }, 100);
  }

  salvaLog() {
    if (this.debuggone !== '') {
      let d = this.debuggone;
      while (d.indexOf('<br />') > -1) {
        d = d.replace('<br />', '\n');
      }
      this.file.writeFile(this, 9, 'LooigiSoft', 'looWebPlayer/log.txt', d).then((Ritorno) => {
        this.utility.visualizzaMessaggio(this, 'Scrittura log eseguita', true);
      });
    }
  }

  converteNumeri(c) {
    let cc = '';

    for (let i = 0; i < c.length; i++) {
      cc += c.charCodeAt(i) + ';';
    }
    return cc;
  }

  mandaEmail() {
    if (this.debuggone !== '') {
      const quanto = 4096;
      let numero = 1;
      const d = this.debuggone;

      for (let i = 0; i <= d.length; i += quanto) {
        let parte = this.converteNumeri(d.substring(i, i + quanto));
        this.apiService.InviaMail(
          { Destinatario: 'looigi@gmail.com',
            Oggetto: 'Invio log LWP ' + numero, 
            Corpo: parte }
          ).map(response => this.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
                if (data2.indexOf('ERROR:') === -1) {
                  this.utility.visualizzaMessaggio(this, 'Log inviato', true);
                } else {
                  this.utility.visualizzaMessaggio(this, 'Problema su invio log: ' + data2, true);
                }
              }
            },
            (error) => {
              if (error instanceof Error) {
                this.utility.visualizzaMessaggio(this, 'Invio log: ' + error.message, true);
              }
            }
        );
        numero++;
      }
    }
  }

  aggiungeTag() {
    this.mostraAggiungeTag = true;

    this.aggiornaTag();
  }

  aggiornaTag() {
    this.listaTagsVisualizzati = new Array();
    this.listaTags.forEach(element => {
      let ok = 'true';
      if (this.tagsBrano) {
        this.tagsBrano.forEach(element2 => {
          if (ok === 'true' && +element.idTag === +element2.idTag) {
            ok = 'false';
          }
        });
      }
      if (ok === 'true') {
        this.listaTagsVisualizzati.push(element);
      }
    });
  }

  eliminaTag(id) {
    this.apiService.EliminaTagDaBrano(
      this.idUtenza,
      { 
        NumeroBrano: this.numeroBrano,
        idTag: id
      }
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            if (data2.indexOf('ERROR:') === -1) {
              const t = new Array();
              this.tagsBrano.forEach(element => {
                if (+element.idTag !== +id) {
                  t.push(element);
                }
              });
              this.tagsBrano = t;

              this.aggiornaTag();

              this.sistemaTagAListaBrani();
            } else {
              this.utility.visualizzaMessaggio(this, 'Aggiunge tag a brano: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Aggiunge tag a brano: ' + error.message, true);
          }
        }
    )
  }

  selezionaTag(id, testo) {
    this.apiService.AggiungeTagABrano(
      this.idUtenza,
      { 
        NumeroBrano: this.numeroBrano,
        idTag: id
      }
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            if (data2.indexOf('ERROR:') === -1) {
              let progressivo = 0;
              this.tagsBrano.forEach(element => {
                if (element.Progressivo > progressivo) {
                  progressivo = element.Progressivo;
                }
              });
              progressivo ++;
              const tt = {
                Progressivo: progressivo,
                idTag: +id,
                Tag: testo
              }
              this.tagsBrano.push(tt);

              this.aggiornaTag();

              this.sistemaTagAListaBrani();
            } else {
              this.utility.visualizzaMessaggio(this, 'Aggiunge tag a brano: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Aggiunge tag a brano: ' + error.message, true);
          }
        }
    )
  }

  sistemaTagAListaBrani() {
    // console.log(this.braniFiltrati);
    // console.log(this.artista);
    // console.log(this.album);
    // console.log(this.titoloBrano);
    this.braniFiltrati.forEach(element => {
      if (element.text === this.artista) {
        // console.log('Trovato artista', element);
        const albums = element.children;
        albums.forEach(element2 => {
          if (element2.text === this.album) {
            // console.log('Trovato album', element2);
            const brani = element2.children;
            brani.forEach(element3 => {
              if (element3.text === this.titoloBrano) {
                let t = '';
                let progressivo = 1;
                this.tagsBrano.forEach(element4 => {
                  t += progressivo + ';' + element4.idTag + ';' + element4.Tag + '§';
                  progressivo++;
                });
                element3.tags = t;
                // console.log(element3, this.tagsBrano);
              }
            });
          }
        });
      }
    });
  }

  aggiungeTagALista() {
    if (this.nuovoTag === '') {
      this.utility.visualizzaMessaggio(this, 'Inserire un tag', true);
      return;
    }
    this.apiService.SalvaTag(
      { 
        Tag: this.nuovoTag
      }
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            if (data2.indexOf('ERROR:') === -1) {
              const tt = {
                idTag: +data2,
                Tag: this.nuovoTag
              }
              this.listaTags.push(tt);
              this.listaTagsVisualizzati.push(tt);
              this.nuovoTag = '';
            } else {
              this.utility.visualizzaMessaggio(this, 'Aggiunge tag a lista: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Aggiunge tag a lista: ' + error.message, true);
          }
        }
    )
  }

  eliminaTagDaLista(id) {
    this.apiService.EliminaTag(
      { 
        idTag: id
      }
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            if (data2.indexOf('ERROR:') === -1) {
              const l = new Array();
              this.listaTagsVisualizzati.forEach(element => {
                if (+element.idTag !== +id) {
                  l.push(element);
                }
              });
              this.listaTagsVisualizzati = l;

              const l2 = new Array();
              this.listaTags.forEach(element => {
                if (+element.idTag !== +id) {
                  l2.push(element);
                }
              });
              this.listaTags = l2;
            } else {
              this.utility.visualizzaMessaggio(this, 'Aggiunge tag a lista: ' + data2, true);
            }
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Aggiunge tag a lista: ' + error.message, true);
          }
        }
    )
  }

  filtraBrani() {
    // console.log('Filtro', this.filtroImpostato);
    // if (this.filtroImpostato.length > 2) {
      this.utility.filtraBrani(this);
    // }
  }

  metteToglieTasti() {
    this.visuaTasti = !this.visuaTasti;
  }

  cambiaUtente() {
    this.apiService.creaUtenza('')
    .map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          this.utility.scriveDebug(this, 'Lettura utenza: ok');
          // alert(data);
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            // console.log(JSON.parse(data2));
            if (data2.indexOf('ERROR:') === -1) {
              // Utenza da scegliere
              const d = data2.split('§');
              this.Utenti = new Array();
              d.forEach(element => {
                if (element && element !== '') {
                  const dd = element.split(';');
                  const ddd = {
                    idUtente: +dd[0],
                    Utente: dd[1],
                    Amministratore: dd[2],
                    Password: dd[3]
                  }
                  this.Utenti.push(ddd);
                }
              });
              // console.log('Lista Utenti', this.Utenti);
              this.caricamentoInCorso = false;
              this.mostraSceltaUtenti = true;
            } else {
              // alert('data2');
              this.utility.visualizzaMessaggio(this, 'Lettura utenza: ' + data2, true);
            }
          } else {
            this.utility.visualizzaMessaggio(this, 'Lettura utenza: Nessun dato ricevuto', true);
          }
        },
        (error) => {
          if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Lettura utenza: ' + error.message, true);
          }
        }
      );
  }
  
  selezionaUtente(u) {
    this.utenteScelto = u;
    this.pwd = '';
    this.passwordBox = true;
  }

  checkPassword() {
    // console.log(this.utenteScelto, this.pwd);
    if (this.utenteScelto.Password === this.pwd) {
      this.utenza = this.utenteScelto.Utente;
      this.idUtenza = +this.utenteScelto.idUtente;
      this.Amministratore = this.utenteScelto.Amministratore;

      localStorage.setItem('utenza', this.utenza);
      localStorage.setItem('idUtenza', this.idUtenza.toString());
      localStorage.setItem('tipoUtente', this.Amministratore);

      this.passwordBox = false;
      this.utenteScelto = undefined;
      this.pwd = '';
      this.mostraSceltaUtenti = false;

      // // this.caricaTutto();
    } else {
      alert('Passowrd errata o non valida');
    }
  }

  uploadBrani() {
    // console.log('UPLOAD');
    this.mascheraUploadVisibile = !this.mascheraUploadVisibile;
  }

  settaZIndex(n) {
    /* if (this.lastClickZIndex === n) {
      return;
    } */
    this.lastClickZIndex = n;
    let conta = 0;
    let valore = 1000;
    this.zIndex.forEach(element => {
      if (+conta === +n) {
        this.zIndex[conta] = 1900;
      } else {
        this.zIndex[conta] = valore;
      }

      valore += 10;
      conta++;
    });
    // console.log('ZIndex: ', this.nomiDiv, this.zIndex);

    let nn = 0;
    this.nomiDiv.forEach(element => {
      if (element && element !== '' && element !== null) {
        // console.log(element);
        const ogg = document.getElementById(element);
        if (ogg && ogg !== null) {
          ogg.style.zIndex = this.zIndex[nn].toString();
        }
      }
      nn++;
    });
  }

  aprePannellogestioneBrani() {
    // console.log('Apro pannello gestione brani');
    this.mascheraGestioneBrani = true;
    setTimeout(() => {
      this.settaZIndex(8);
    }, 100);
  }

  aprePannelloUtility() {
    // console.log('Apro pannello utility');
    this.pannelloUtility = true;
    setTimeout(() => {
      this.settaZIndex(7);
    }, 100);
  }

  apreDettaglioArtisti() {
    // console.log('Apro pannello dettalio artisti');
    this.mascheraArtisti = true;
    setTimeout(() => {
      this.settaZIndex(4);
    }, 100);
  }

  aprePannelloDebug() {
    // console.log('Apro pannello debug');
    this.debug = true;
    setTimeout(() => {
      this.settaZIndex(1);
    }, 100);
  }

  scrollaTesto(cosa, campo, n) {
    this.utility.scriveDebug(this, 'Scrolla testo. Cosa:' + cosa);
    this.utility.scriveDebug(this, 'Scrolla testo. Campo:' + campo);
    if (campo !== '') {
      const t = document.getElementById(cosa);
      this.utility.scriveDebug(this, 'Scrolla testo:' + JSON.stringify(t));
      // console.log(t);
      if (t && t !== null) {
        const lungh = +t.offsetWidth;
        const fs1 = t.style.fontSize;
        let fs;
        if (fs1 && fs1 !== null && fs1.indexOf('px') > -1) {
          fs = +(fs1.replace('px', ''));
        } else {
          fs = 14;
        }
        const caratteri = Math.round(lungh / (fs * .5));

        if (campo.length > caratteri) {
          for (let i = 0; i <= (caratteri / 2); i++) {
            campo = ' ' + campo;
            campo += ' ';
          }

          console.log('Lunghezza campo: ', lungh);
          console.log('Dimensione font: ', fs);
          console.log('Caratteri: ', caratteri);
          console.log('Scritta: >>>' + campo + '<<<');

          this.lunghezzaCampo[n] = campo.length;
          this.posizioneCarattere[n] = 0

          this.testoScrollabile[n] = campo.substring(this.posizioneCarattere[n], this.posizioneCarattere[n] + caratteri);

          if (this.scrollTimer[n] && this.scrollTimer[n] !== null) {
            clearInterval(this.scrollTimer[n]);
            this.scrollTimer[n] = null;
          }
          this.scrollTimer[n] = setInterval(() => {
            this.posizioneCarattere[n]++;
            if (this.posizioneCarattere[n] > this.lunghezzaCampo[n]) {
              this.posizioneCarattere[n] = 0;
            }
            this.testoScrollabile[n] = campo.substring(this.posizioneCarattere[n], this.posizioneCarattere[n] + caratteri);
          }, 100);
        } else {
          this.testoScrollabile[n] = campo;
        }
      } else {
        if (this.scrollTimer[n] && this.scrollTimer[n] !== null) {
          clearInterval(this.scrollTimer[n]);
          this.scrollTimer[n] = null;
        }
        this.testoScrollabile[n] = campo;
      }
    } else {
      if (this.scrollTimer[n] && this.scrollTimer[n] !== null) {
        clearInterval(this.scrollTimer[n]);
        this.scrollTimer[n] = null;
      }
      this.testoScrollabile[n] = '';
    }
  }
}
