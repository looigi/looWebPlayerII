import { AfterViewInit, Component, Injectable, OnChanges, OnInit } from "@angular/core";
import {throwError as observableThrowError, Observable} from 'rxjs';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { map } from "rxjs/operators";
import { CaricaBranoAutomaticoComponent } from "./caricabranoautomatico.component";
import { ComponentFile } from "./files";
import { ApiService } from "../services/api2.service";
import { HttpService } from "../services/httpclient.service";
import { UtilityComponent } from "./utility.component";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Http, RequestOptions, ResponseContentType } from "@angular/http";
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';

@Injectable()
export class CaricaBranoComponent implements OnInit, AfterViewInit, OnChanges {
  braniCaricati = 0;
  branoRilevato;
  frm;

  constructor(
      public utility: UtilityComponent,
      private http: HttpService,
      private media: Media,
      private caricaBranoAuto: CaricaBranoAutomaticoComponent
  ) {}

  ngOnInit() {
      
  }

  ngOnChanges() {

  }

  ngAfterViewInit() {

  }

  caricaBranoGiaCaricato(t) {
    t.caricamentoInCorso = true;
    this.caricaBranoAuto.settaVariabili(t);
    this.prendeScritte(t);
    t.utility.scriveDebug(t, 'Carico brano già caricato. Impostate variabili');
    this.prosegueCaricamento(t);
    t.impostaBellezza();
    t.startTimerImmagine();
    t.utility.scriveDebug(t, 'Carico brano già caricato. Fine');
  }

  prendeBranoInBaseAID(t, id) {
    let brano = undefined;
    t.braniFiltrati.forEach(element => {
      if (!brano) {
        // this.Artista = element.text;
        element.children.forEach(element2 => {
          if (!brano) {
            // this.Album = element2.text;
            element2.children.forEach(element3 => {
              if (!brano) {
                if (element3.id === id) {
                  // this.Brano = element3.text;
                  // t.utility.scriveDebug(t, 'Rilevato brano: ' + this.Brano);
                  brano = element3;
                  this.branoRilevato = {
                    Artista: element.text,
                    Anno: element2.anno,
                    Album: element2.text,
                    Brano: element3.text
                  };
                  t.pathBranoProssimo = element3.path;
                  t.branoPresenteSuSD = element3.locale;
                }
              }
            });
          }
        });
      }
    });
  }

  caricaBrano(t) {
    t.utility.scriveDebug(t, 'Carico brano normale. Caricato prossimo brano: ' + t.caricatoProssimoBrano);
    if (t.deviceGirante === 'Android' && t.caricatoProssimoBrano > -1) {
          t.utility.scriveDebug(t, 'Carico brano già caricato. Inizio');
          this.caricaBranoGiaCaricato(t);
          this.utility.scriveDebug(this, 'Azzero prossimo brano 4');
          t.caricatoProssimoBrano = -1;
          return;
    }

    t.caricamentoInCorso = true;

    t.utility.scriveDebug(t, 'Carico brano normale. Inizio caricamento brano normale');

    const ora = new Date();
    const milli = ora.getTime();
    if (milli - t.vecchioMilli < 500) {
      // return;
    }
    t.vecchioMilli = milli;
    // console.log(milli);

    t.immagineBrano = '';
    t.immagineSfondo = '';
    t.titoloBrano = '';
    t.artista = '';
    t.album = '';
    if (t.intervalDurata) {
      clearInterval(t.intervalDurata);
    }

    t.utility.scriveDebug(t, 'Carico brano normale. 1... idBrano: ' + t.numeroBrano);
    t.utility.scriveDebug(t, 'Carico brano normale. 1.5... Connesso: ' + t.isConnected);
    t.utility.scriveDebug(t, 'Carico brano normale. 1.75... Brano presente su SD: ' + t.deviceGirante + ' - ' + t.branoPresenteSuSD);

    if (t.deviceGirante === 'Android' && t.branoPresenteSuSD) {
      t.utility.scriveDebug(t, 'Cerco id brano: ' + t.numeroBrano);
      this.prendeBranoInBaseAID(t, t.numeroBrano);
      // Il brano è già stato scaricato... Inutile riprenderlo
      ComponentFile.percorsoFileSD = ComponentFile.pathSD + t.pathBranoProssimo;
      t.utility.scriveDebug(t, 'Carico brano da locale: ' + ComponentFile.percorsoFileSD);
      t.utility.scriveDebug(t, 'Carico brano Path: ' + t.pathBranoProssimo);

      let ff = t.pathBranoProssimo;
      let branoLoo = true;
      if (ff.indexOf('looWebPlayer') === -1) {
        branoLoo = false;
      }
      ff = ff.substring(ff.indexOf('LooigiSoft'), ff.length);
      t.utility.scriveDebug(t, 'Parso stringa:' + ff);
      const parti = ff.split('/');
      // LooigiSoft/looWebPlayer/Brani/Artista/Album/Brano

      if (branoLoo === true) {
        t.artista = parti[3];
        t.album = parti[4];
        if (t.album.indexOf('-') > -1) {
          const a = t.album.split('-');
          t.anno = a[0];
          t.album = a[1];
        } else {
          t.anno = '0000';
        }
        // t.utility.scriveDebug(t, 'Parso stringa. Anno ' + t.anno);
        t.titoloBrano = parti[5];
        if (t.titoloBrano.indexOf('-') > -1) {
          const a = t.titoloBrano.split('-');
          t.traccia = a[0];
          t.titoloBrano = a[1];
        } else {
          t.traccia = '00';
        }
        if (t.titoloBrano.indexOf('.') > -1) {
          const a = t.titoloBrano.split('.');
          t.estensioneBrano = '.' + a[1];
          t.titoloBrano = a[0];
        } else {
          t.estensioneBrano = '';
        }
      } else {
        t.artista = 'Sconosciuto';
        t.album = 'Sconosciuto';
        t.traccia = '00';
        t.anno = '0000';
        t.titoloBrano = parti[parti.length - 1];
        if (t.titoloBrano.indexOf('.') > -1) {
          const a = t.titoloBrano.split('.');
          t.estensioneBrano = '.' + a[1];
          t.titoloBrano = a[0];
        } else {
          t.estensioneBrano = '';
        }
      }

      t.titoloBranoAutomatico = t.titoloBrano;
      t.scrollaTesto('txtTitoloBranoAutomatico', t.titoloBranoAutomatico, 0);

      t.utility.scriveDebug(t, 'Carico brano normale. Path ' + ComponentFile.percorsoFileSD);
      t.utility.scriveDebug(t, 'Carico brano normale. Artista ' + t.artista);
      t.utility.scriveDebug(t, 'Carico brano normale. Anno ' + t.anno);
      t.utility.scriveDebug(t, 'Carico brano normale. Album ' + t.album);
      t.utility.scriveDebug(t, 'Carico brano normale. Titolo ' + t.titoloBrano);
      t.utility.scriveDebug(t, 'Carico brano normale. Traccia ' + t.traccia);
      t.utility.scriveDebug(t, 'Carico brano normale. Estensione ' + t.estensioneBrano);
      t.utility.scriveDebug(t, 'Carico brano normale. Titolo ' + t.titoloBrano);

      // t.imms = [];
      t.volteAscoltata = -1;
      t.numeroBrano = t.numeroBrano;
      t.quantiBrani = t.quantiBrani;
      t.dataBrano = '';
      t.dimensione = '';
      t.testo = '';
      t.testoTradotto = '';
      t.pathBrano = ComponentFile.percorsoFileSD;
      t.tipo = '';
      t.posizioneBrano = 0;
      t.durata = 1;
      t.quanteImmagini = 0;

      const pathImmagine = t.urlImmagine + 'ImmaginiMusica/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
      t.immagineBrano = pathImmagine;
      t.immagineSfondo = pathImmagine;

      t.utility.leggeTestoSeEsiste(t, t.artista, t.album, t.titoloBrano);
      t.utility.leggeImmagineSeEsiste(t, t.artista, t.album, t.titoloBrano);

      t.utility.scriveDebug(t, 'Path immagine ' + pathImmagine);

      this.prosegueCaricamento(t);
      t.utility.scriveDebug(t, 'Fine proseguo caricamento');

      t.caricamentoInCorso = false;

      t.imms = new Array();
      t.scritte = new Array();
      this.prendeScritte(t);
    } else {
      const params = {
        NumeroBrano: t.numeroBrano
      };
  
      if (t.isConnected) {
        t.utility.scriveDebug(t, 'Carico brano normale. 1.75... Ritorna brano: ' + params.NumeroBrano);
        t.apiService.ritornaBrano(
          t.idUtenza,
          params, 
          this
        ).map(response => t.apiService.controllaRitorno(response))
        .subscribe(
          data => {
            t.utility.scriveDebug(t, 'Carico brano normale. 1.9...');
            t.caricamentoInCorso = false;
            if (data) {
              const data2 = t.apiService.prendeSoloDatiValidi(data);
              // console.log(data2);
  
              t.utility.scriveDebug(t, 'Carico brano normale. 2... Ritornato brano...');
          
              if (data2.indexOf('ERROR:') === -1) {
                const dati = data2.split('|');
                const datiCanzone = dati[0].split(';');
                if (dati[1]) {
                  if (dati[1].indexOf('§') > -1) {
                    t.imms = dati[1].split('§');
                  } else {
                    t.imms = new Array();
                  }
                } else {
                  t.imms = new Array();
                }
                // t.quanteImmagini = t.imms.length;
                // this.utility.scriveDebug(t, 'Numero immagini artista:' + t.imms.length);

                let datiCanzoneUlteriori = new Array();
                if (dati[2]) {
                  if (dati[2].indexOf(';') > -1) {
                    datiCanzoneUlteriori = dati[2].split(';');
                  }
                }
                // console.log(datiCanzone);
                
                t.volteAscoltata = +datiCanzoneUlteriori[0];
    
                t.numeroBrano = +datiCanzone[0];
                t.quantiBrani = +datiCanzone[1];
                t.titoloBrano = datiCanzone[5];
                t.artista = datiCanzone[3];
                t.estensioneBrano = datiCanzone[8];
                t.album = datiCanzone[4];
                t.anno = datiCanzone[6];
                t.traccia = datiCanzone[7];
                t.dataBrano = datiCanzone[9];
                t.dimensione = datiCanzone[10];
    
                if (t.traccia.length === 1) {
                  t.traccia = '0' + t.traccia;
                }
                for (let i = t.anno.length + 1; i <= 4; i++) {
                  t.anno = '0' + t.anno;
                }
                // t.impostaBellezza();

                t.titoloBranoPerTesto = t.utility.sistemaTitoloBrano(t.titoloBrano);
                console.log('Titolo brano: ', t.titoloBranoPerTesto);
    
                // t.titoloBranoAutomatico = t.titoloBrano;
                t.scrollaTesto('txtTitoloBranoAutomatico', t.titoloBrano, 0);
          
                t.testo = t.sistemaTesto(datiCanzoneUlteriori[2]);
        
                // console.log(t.testo);
                if (t.testo === '') {
                  t.testo = datiCanzone[3].toUpperCase() + '<br />' + t.titoloBranoPerTesto + '<br /><br />Nessun testo rilevato';
                }

                if (t.testo.indexOf('Nessun testo rilevato') > -1) {
                  t.Happi.prendeArtista(t, t.numeroBrano, t.artista, t.album, t.titoloBranoPerTesto);
                } else {
                  if (t.deviceGirante === 'Android') {
                    t.utility.scriveTestoSeNonEsiste(t, t.artista, t.album, t.titoloBranoPerTesto, t.testo);
                  }  
                }

                t.testoTradotto = t.sistemaTesto(datiCanzoneUlteriori[3]);
                if (t.testoTradotto === '') {
                  t.testoTradotto = datiCanzone[3].toUpperCase() + '<br />' + t.titoloBranoPerTesto + '<br /><br />Nessun testo rilevato';
                }
                // console.log(t.testo);
                // console.log(t.testoTradotto);
    
                t.utility.scriveDebug(t, 'Carico brano normale. 3...');
            
                if (t.estensioneBrano.indexOf('.') > -1) {
                  t.estensioneBrano = t.estensioneBrano.substring(t.estensioneBrano.indexOf('.'), t.estensioneBrano.length);
                }
                this.prendeScritte(t);
    
                t.utility.scriveDebug(t, 'Carico brano normale. 4...');
            
                /* if (t.deviceGirante === 'Android') {
                  t.pathBrano = t.apiService.ritornaUrlMP3() + 'Brani/' + 
                    t.artista + '/' + t.anno + '-' + t.album + '/' + 
                    t.traccia + '-' + t.titoloBrano + t.estensioneBrano;
                } else { */
                  t.pathBrano = t.apiService.ritornaUrlMP3() + 'MP3/' + 
                    t.artista + '/' + t.anno + '-' + t.album + '/' + 
                    t.traccia + '-' + t.titoloBrano + t.estensioneBrano;
                // }
                t.tipo = 'audio/mpeg';
                if (t.titoloBrano.toUpperCase().indexOf('.MP3') > -1)  {
                  t.titoloBrano = t.titoloBrano.replace('.mp3', '');
                  t.tipo = 'audio/mpeg';
                }
                if (t.titoloBrano.toUpperCase().indexOf('.WMA') > -1)  {
                  t.titoloBrano = t.titoloBrano.replace('.wma', '');
                  t.tipo = 'audio/x-ms-wma';
                }
                while (t.pathBrano.indexOf(' ') > -1) {
                  t.pathBrano = t.pathBrano.replace(' ', '%20');
                }
    
                const cartelletta = 'LooigiSoft';
                const titolone = 'looWebPlayer/Brani/' + t.artista + '/' + t.anno + '-' + t.album + '/' + t.traccia + '-' + t.titoloBrano + t.estensioneBrano;
    
                t.utility.scriveDebug(t, 'Carico brano normale. Download tags brano');
                this.prendeTagsBrano(t);

                if (t.deviceGirante === 'Android') {
                  // ComponentFile.percorsoFileSD = '';
                  t.utility.scriveDebug(t, 'Carico brano normale. Download brano: ' + t.pathBrano);
                  t.utility.scriveDebug(t, 'Carico brano normale. Cartella: ' + cartelletta);
                  t.utility.scriveDebug(t, 'Carico brano normale. Titolo: ' + titolone);
                  t.file.downloadBrano(t, t.pathBrano, cartelletta, titolone).then((Ritorno) => {
                    if (Ritorno === 'OK') {
                      t.utility.scriveDebug(t, 'Carico brano normale. 4.1 ... Ritorno download *' + Ritorno + '*' + '\nFile: *' + ComponentFile.percorsoFileSD + '*');

                      const pathImmagine = t.urlImmagine + 'ImmaginiMusica/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
                      const titolone = 'looWebPlayer/ImmaginiMusica/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';

                      t.file.downloadImmagine(t, pathImmagine, 'LooigiSoft', titolone).then((Ritorno2) => {
                      });        

                      this.prosegueCaricamento(t);
                    } else {
                      t.utility.scriveDebug(t, 'Errore nel DL. Provo a prendere un altro brano');
                      alert('Errore nel DL: ' + ComponentFile.percorsoFileSD);
                      t.avantiBrano();
                    }
                  });
                  /* const si = setInterval(() => {
                    if (ComponentFile.percorsoFileSD !== '') {
                      clearInterval(si);
  
                      ComponentFile.percorsoImmagineSD = '';
                      const pathImmagine = t.urlImmagine + 'Immagini/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
                      const titolone = 'looWebPlayer/Immagini/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
                      // alert(pathImmagine);
                      // alert(titolone);
                      t.files.downloadImmagine(pathImmagine, 'LooigiSoft', titolone);
                      const si2 = setInterval(() => {
                        if (ComponentFile.percorsoImmagineSD !== '') {
                          clearInterval(si2);
                        }
                      }, 100)
        
                      this.prosegueCaricamento(t);
                    }
                  }, 100) */      
                } else {
                  if (!t.pathBrano || t.pathBrano === '') {
                    t.utility.scriveDebug(t, 'Errore nel DL. Path brano vuoto... Provo a prendere un altro brano');
                    alert('Errore nel DL. Path brano vuoto');
                    t.avantiBrano();
                  } else {
                    ComponentFile.percorsoFileSD = t.pathBrano;
                    this.prosegueCaricamento(t);
                  }
                }
              } else {
                t.utility.scriveDebug(t, 'Carico brano normale. 19... ' + data2);
                t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data2, true);
  
                if (t.staSuonando) {
                  setTimeout(() => {
                    t.avantiBrano();
                  }, 2000); 
                }
              }
            } else {
              t.utility.scriveDebug(t, 'Carico brano normale. 20... ' + data);
              t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data, true);
  
              if (t.staSuonando) {
                setTimeout(() => {
                  t.avantiBrano();
                }, 2000); 
              }
            }
          },
          (error) => {
            if (error instanceof Error) {
              t.caricamentoInCorso = false;
              t.utility.visualizzaMessaggio(this, 'Errore Carica Brano: ' + error.message, true);
              alert('Errore ritorno carica brano: ' + error .message);
            }
          }
        );
      } else {
        if (t.deviceGirante === 'Android') {
          // Non c'è connessione... Siamo su un dispositivo Android così tento di prendere un brano su SD
          t.utility.scriveDebug(t, 'Carico brano normale. Nessuna connessione, Android');
          t.numeroBrano = t.prendeNumeroProssimoBrano(9);
          t.utility.scriveDebug(t, 'Carico brano normale. Brano in locale: ' + t.numeroBrano);
          this.prendeBranoInBaseAID(t, t.numeroBrano);

          const brano = this.branoRilevato.Brano;
          const artista = this.branoRilevato.Artista;
          const album = this.branoRilevato.Anno + '-' + this.branoRilevato.Album;
          const nome = brano.traccia + '-' + brano.text;
          const estensione = brano.estensione;
          const nomeBrano = t.file.sistemaNomeFile('looWebPlayer/Brani/' + artista + '/' + album + '/' + nome + '.' + estensione);
          t.utility.scriveDebug(t, 'Carico brano normale. Path brano in locale: ' + nomeBrano);

          t.titoloBrano = brano.text
          t.artista = this.branoRilevato.Artista;
          t.estensioneBrano = brano.estensione;
          t.album = this.branoRilevato.Album;
          t.anno = this.branoRilevato.Anno;
          t.traccia = brano.traccia;
          t.dataBrano = '';
          t.dimensione = -1;
          this.prendeScritte(t);

          t.tipo = 'audio/mpeg';
          if (t.titoloBrano.toUpperCase().indexOf('.MP3') > -1)  {
            t.titoloBrano = t.titoloBrano.replace('.mp3', '');
            t.tipo = 'audio/mpeg';
          }
          if (t.titoloBrano.toUpperCase().indexOf('.WMA') > -1)  {
            t.titoloBrano = t.titoloBrano.replace('.wma', '');
            t.tipo = 'audio/x-ms-wma';
          }

          const pathTesto = t.file.sistemaNomeFile(ComponentFile.pathSD + '/LooigiSoft/Testi/' + artista + '/' + album + '/' + nome + '.txt');
          t.utility.scriveDebug(t, 'Carico brano normale. Path testo in locale: ' + pathTesto);
          t.file.readFile(t, pathTesto, 7).then((Ritorno: string) => {
            t.testoTradotto = '';
            t.testo = t.sistemaTesto(Ritorno);

            const pathImmagine = t.urlImmagine + 'ImmaginiMusica/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
            t.utility.scriveDebug(t, 'Carico brano normale. Path immagine in locale: ' + pathImmagine);
            t.file.readFile(t, pathImmagine, 5).then((Ritorno: string) => {
              t.immagineSfondo = Ritorno;
              t.immagineBrano = Ritorno;
    
              t.pathBrano = nomeBrano;
              ComponentFile.percorsoFileSD = t.pathBrano;
  
              t.utility.scriveDebug(t, 'Carico brano normale. Proseguo caricamento del brano in locale');
              // return; // QUI
              this.prosegueCaricamento(t);
            });
          });
        } else {
          alert('Connessione assente. Non riesco ad ottenere un brano');
        }
        // Non c'è rete, prendo i files in locale
        // alert('Nessuna rete, prendo un file in locale');
        /*
        const si = setInterval(() => {
          if (!ComponentFile.staLeggendoFiles) {
            clearInterval(si);
            t.caricamentoInCorso = false;
  
            const x = Math.floor(Math.random() * ComponentFile.filesInMemoria.length);
            const f = ComponentFile.filesInMemoria[x];
            let ff = f;
            ff = ff.substring(ff.indexOf('LooigiSoft'), ff.length);
            // alert(ff);
            const parti = ff.split('/');
            ComponentFile.percorsoFileSD = ComponentFile.pathSD + f;
            // alert('File in locale preso\n' + f);
  
            t.artista = parti[3];
            t.album = parti[4];
            if (t.album.indexOf('-') > -1) {
              const a = t.album.split('-');
              t.anno = a[0];
              t.album = a[1];
            } else {
              t.anno = '0000';
            }
            t.titoloBrano = parti[5];
            if (t.titoloBrano.indexOf('-') > -1) {
              const a = t.titoloBrano.split('-');
              t.traccia = a[0];
              t.titoloBrano = a[1];
            } else {
              t.traccia = '00';
            }
            if (t.titoloBrano.indexOf('.') > -1) {
              const a = t.titoloBrano.split('.');
              t.estensioneBrano = '.' + a[1];
              t.titoloBrano = a[0];
            } else {
              t.estensioneBrano = '';
            }
  
            t.testo = t.artista.toUpperCase() + '<br />' + t.titoloBrano.toUpperCase();
  
            const pathImmagine = t.urlImmagine + 'Immagini/' + t.artista + '/' + t.anno + '-' + t.album + '/Cover_' + t.artista + '.jpg';
            t.immagineBrano = pathImmagine;
            t.immagineSfondo = pathImmagine;

            console.log('Immagine brano 1: ', t.immagineBrano);
            console.log('Immagine sfondo 1: ', t.immagineSfondo);

            // alert(pathImmagine);
  
            this.prosegueCaricamento(t);
  
            t.imms = new Array();
            t.scritte = new Array();
            this.prendeScritte(t);
          }
        }, 100); */
      }
    }
  }

  prendeTagsBrano(t) {
    const params = {
      NumeroBrano: t.numeroBrano
    };
    t.tagsBrano = new Array();
    t.apiService.ritornaTagsBrano(params)
    .map(response => t.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          const data2 = t.apiService.prendeSoloDatiValidi(data);
          t.utility.scriveDebug(t, 'Tags brano: ' + data2);
          if (data2.indexOf('ERROR:') === -1) {
            if (data2 && data2 !== '' && data2 !== '-') {
              const dd = data2.split('§');
              dd.forEach(element => {
                if (element && element !== '') {
                  const d2 = element.split(';');
                  const tt = {
                    Progressivo: +d2[0],
                    idTag: +d2[1],
                    Tag: d2[2]
                  }
                  t.tagsBrano.push(tt);
                }
              });
            }
          }
    },
    (error) => {
      if (error instanceof Error) {
        t.utility.visualizzaMessaggio(this, 'Lettura Tags: ' + error.message, true);
      }
    });
  }

  prendeScritte(t) {
    t.utility.scriveDebug(t, 'Prende scritte 1');

    t.scritte = new Array();
    if (t.titoloBrano.indexOf('-') > -1) {
      const t1 = t.titoloBrano.split('-');
      if (t1[1].indexOf('.') > -1) {
        const tt = t1[1].split('.');
        t.scritte.push('Titolo: ' + tt[0]);
        t.scritte.push('Traccia: ' + t[0]);
        t.scritte.push('Tipologia: ' + tt[1]);
      } else {
        t.scritte.push('Titolo: ' + t[1]);
        t.scritte.push('Traccia: ' + t[0]);
      }
    } else {
      t.scritte.push('Titolo: ' + t.titoloBrano);
    }
    t.scritte.push('Artista: ' + t.artista);
    if (t.album.indexOf('-') > -1) {
      const t1 = t.album.split('-');
      t.scritte.push('Album: ' + t1[1]);
      t.scritte.push('Anno: ' + t1[0]);
    } else {
      t.scritte.push('Album: ' + t.album);
    }
    t.scritte.push('Numero Brano: ' + t.numeroBrano + '/' + t.quantiBrani);
    if (t.dimensione) {
      let d = t.dimensione;
      let f = 'b.';
      if (d>1024) {
        d/=1024;
        f = 'kb.';
      }
      if (d>1024) {
        d/=1024;
        f = 'Mb.';
      }
      d = Math.floor(d * 100) / 100;
      t.scritte.push('Dimensione Brano: ' + d + ' ' + f);
    }
    t.scritte.push('Data Brano: ' + t.dataBrano);
    t.qualeScritta = 0;

    t.utility.scriveDebug(t, 'Prende scritte 2: ' + t.scritte.length);
  }

  downloadFile(t, url): Observable<Blob> {
    let options = new RequestOptions({responseType: ResponseContentType.Blob });
    let u = url; // encodeURIComponent(url);
    u = t.apiService.cambiaChar(u, '&', '%26');
    u = t.apiService.cambiaChar(u, '\'', '%27');

    t.utility.scriveDebug(t, 'Download ' + u);
    return this.http.get(u, options)
        .map(res => res.blob())
        // .catch(this.handleError)
  }

  async prosegueCaricamento(t) {
    this.frm = t;

    t.utility.scriveDebug(t, 'Prosegue caricamento');
    t.utility.scriveDebug(t, 'Carico brano normale. 5...' + t.titoloBrano + ' - ' + t.tipo);
    t.utility.scriveDebug(t, 'Carico brano normale. 5.2...' + ComponentFile.percorsoFileSD);
        
    if (t.impostatoBranoFinito === true) {
      t.impostatoBranoFinito = false;
    }

    t.caricamentoInCorso = true;
    t.contaTimer = 0;

    if (t.deviceGirante !== 'Android') {
      let u = ComponentFile.percorsoFileSD; // encodeURIComponent(ComponentFile.percorsoFileSD);
      u = t.apiService.cambiaChar(u, '&', '%26');
      u = t.apiService.cambiaChar(u, '\'', '%27');

      t.utility.scriveDebug(t, 'Acquisizione brano ' + u);
        
      const response = await window.fetch(u);

      const audioArrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioArrayBuffer]);
      const audioObjectURL = window.URL.createObjectURL(audioBlob);
      
      // if (t.deviceGirante !== 'Android') {
        t.audio.src = audioObjectURL;
        t.audio.type = 'audio/mp3';
      // } else {
      //  t.audioAndroid = t.media.create(audioObjectURL);
      // }

      this.prosegueCaricamento2();
    } else {
      // if (t.deviceGirante !== 'Android') {
      //   t.audio.src = ComponentFile.percorsoFileSD;

      //   this.prosegueCaricamento2();
      // } else {
        // alert('Brano: ' + ComponentFile.percorsoFileSD);
        // if (t.audioAndroid) { 
        t.utility.scriveDebug(t, 'Acquisizione brano Android 1: ' + ComponentFile.percorsoFileSD);

        try {
          t.audioAndroid.release();
        } catch (e) {

        }
        t.utility.scriveDebug(t, 'Acquisizione brano Android: Rilasciato il vecchio');

        t.audioAndroid = this.media.create(ComponentFile.percorsoFileSD);
        // t.staLeggendoBrano = true;
        t.branoTerminato = false;

        t.audioAndroid.onStatusUpdate.subscribe(status =>  {
          t.utility.scriveDebug(t, 'Update: ' + status);          

          // if (t.staLeggendoBrano === true) {
            if (status === 4) {
              if (t.durata > 1) {
                t.branoTerminato = true;
              }
            }
            /* if (status === 1) {
              setTimeout(() => {
                t.audioAndroid.play();
              }, 100);
            } else {
              if (status === 2) {     
                t.utility.scriveDebug(t, 'Durata brano: ' + t.audioAndroid.getDuration());
                this.prosegueCaricamento2();
                setTimeout(() => {
                  t.audioAndroid.pause();
                  t.staLeggendoBrano = false;
                }, 100);
              }
            } */
          // }
        });

        t.audioAndroid.onSuccess.subscribe(() => 
          {
            // alert('Brano caricato correttamente');
          });

        // alert('Errore: ' + JSON.stringify(error)
        t.audioAndroid.onError.subscribe(error => {
          
        });

        this.prosegueCaricamento2();
      }
    // }
  }

  prosegueCaricamento2() {
    const t = this.frm;

    if (t.deviceGirante !== 'Android') {
      if (!t.audio) {
        t.audio = new Audio();
      }
    } else {
      if (!t.audioAndroid) {
        alert('SBAGLIATISSIMO!!!');
      }
    }
    // t.audio.pause();


    // alert('Brano da caricare:' + Files.percorsoFileSD);

    // t.audio = new Audio();
    
    // console.log(t.pathBrano);



    t.posizioneBrano = 0;
    t.durata = 1;
    /* try {
      t.audio.load();
    } catch (e) {
      t.utility.scriveDebug(t, 'Carico brano normale. ERRORE load: ' + e);
      alert('Errore nel load: ' + JSON.stringify(e));
      
      t.caricatoProssimoBrano = -1;
      t.titoloBranoAutomatico = '';
      t.fFiles.operazioneSuFile = '';

      t.caricamentoInCorso = false;
  
      if (t.staSuonando) {
        setTimeout(() => {
          // t.avantiBrano();
        }, 2000);
      }
      return;
    } */
    
    t.immaginiCambiate = 0;
    t.staAspettandoCaricamento = true;
    t.scaricatoAutomaticamente = false;

    if (t.intervalDurata) {
      clearInterval(t.intervalDurata);
    }
    let errori = 0;
    t.utility.scriveDebug(t, 'Carico brano normale. 5.5... Parte timer di attesa caricamento per il file ' + ComponentFile.percorsoFileSD);
    // alert('Android: ***' + t.deviceGirante + '***');

    if (t.deviceGirante !== 'Android') {
      t.intervalDurata = setInterval(() => {
        if (t.audio.duration) {
          clearInterval(t.intervalDurata);

          this.prosegueCaricamentoBrano(t);

          t.audio.currentTime = 0;
          t.durata = t.audio.duration;
          t.tempoTotaleBrano = t.durata;
          t.tempoTotale = t.converteTempo(t.durata);
          t.posizioneBrano = 0;
          // t.durata = 1;

          t.utility.scriveDebug(t, 'Carico brano normale. 6...' + t.durata + ' - ' + t.tempoTotale + '. Sta suonando: ' + t.staSuonando);
          
          t.scriveVolteAscoltata();

          this.braniCaricati++;
          if (this.braniCaricati > 10) {
            this.braniCaricati = 0;
            ComponentFile.eliminaFiles(t, 3);
          }

          if (t.staSuonando === true) {
            if (!t.staCaricandoVideo) {
              t.audio.play();
            }
            t.startTimerAndroid();
            if (t.cicla === false) {
              t.startTimerImmagine();
            }
          }
          t.staAspettandoCaricamento = false;

          t.caricamentoInCorso = false;
        } else {
          errori++;
          if (errori > 5) {
            clearInterval(t.intervalDurata);

            // alert('Errore nel caricamento del brano.\nNon riesco a ottenere le informazioni.\nCarico il brano successivo...');
            t.utility.scriveDebug(t, 'Errore nel caricamento del brano. Non riesco a ottenere le informazioni: ' + ComponentFile.percorsoFileSD);
            alert('Errore nell\'ottenere le informazioni del brano: ' + ComponentFile.percorsoFileSD);

            this.utility.scriveDebug(this, 'Azzero prossimo brano 5');
            t.caricatoProssimoBrano = -1;
            t.titoloBranoAutomatico = '';
            t.scrollaTesto('txtTitoloBranoAutomatico', t.titoloBranoAutomatico, 0);
            t.fFiles.operazioneSuFile = '';
            t.scrollaTesto('txtOperazioneSuFile', t.fFiles.operazioneSuFile, 1);

            t.caricamentoInCorso = false;
        
            if (t.staSuonando) {
              setTimeout(() => {
                t.avantiBrano();
              }, 2000);
            }
          }
        }
      }, 1000);
    } else {
      /* t.audioAndroid.onError.subscribe(error => {
        t.utility.scriveDebug(t, 'Errore nel caricamento del brano Android. Non riesco a ottenere le informazioni: ' + ComponentFile.percorsoFileSD);
        alert('Errore nell\'ottenere le informazioni del brano: ' + ComponentFile.percorsoFileSD);

        t.caricatoProssimoBrano = -1;
        t.titoloBranoAutomatico = '';
        t.fFiles.operazioneSuFile = '';

        t.caricamentoInCorso = false;
    
        if (t.staSuonando) {
          setTimeout(() => {
            t.avantiBrano();
          }, 2000);
        }
      }); */
      // t.audioAndroid.onSuccess.subscribe(() => {
      // t.intervalDurata = setInterval(() => {
      //   if (t.audioAndroid.getDuration() > 0) {
          clearInterval(t.intervalDurata);
    
          this.prosegueCaricamentoBrano(t);

          t.audioAndroid.seekTo(0);
          t.durata = 1;
          t.posizioneBrano = 0;
    
          t.utility.scriveDebug(t, 'Carico brano normale Android. 6...' + t.durata + ' - ' + t.tempoTotale + '. Sta suonando: ' + t.staSuonando);
          
          t.scriveVolteAscoltata();
    
          this.braniCaricati++;
          if (this.braniCaricati > 10) {
            this.braniCaricati = 0;
            ComponentFile.eliminaFiles(t, 3);
          }
    
          if (t.staSuonando === true) {
            if (!t.staCaricandoVideo) {
              t.audioAndroid.play();
            }
            t.startTimerAndroid();
            if (t.cicla === false) {
              t.startTimerImmagine();
            }
          }
          t.staAspettandoCaricamento = false;
    
          t.caricamentoInCorso = false;  
        /* } else {
          errori++;
          if (errori > 5) {
            clearInterval(t.intervalDurata);

            // alert('Errore nel caricamento del brano.\nNon riesco a ottenere le informazioni.\nCarico il brano successivo...');
            t.utility.scriveDebug(t, 'Errore nel caricamento del brano Android. Non riesco a ottenere le informazioni: ' + ComponentFile.percorsoFileSD);
            alert('Errore nell\'ottenere le informazioni del brano Android: ' + ComponentFile.percorsoFileSD);

            t.caricatoProssimoBrano = -1;
            t.titoloBranoAutomatico = '';
            t.fFiles.operazioneSuFile = '';

            t.caricamentoInCorso = false;
        
            if (t.staSuonando) {
              setTimeout(() => {
                t.avantiBrano();
              }, 2000);
            }
          }
        }
      }, 1000); */
      // });
    };
  }
  
  prosegueCaricamentoBrano(t) {
      t.utility.scriveDebug(t, 'Carico brano normale. 8... Immagini da db: ' + t.imms.length);
  
      t.immagini = new Array();
      let numeroImmagine = -1;
      let c = 0;
      t.inizioImmagini = -1;
      t.quanteImmagini = 0;
      t.imms.forEach(element => {
        if (element) {
          // console.log(element);
          const e = element.split(';');
          const i = {
            idImmagine: +e[0],
            cartella: e[1],
            immagine: e[2]
          };
          // if (i && i.immagine && i.immagine.indexOf('.gif') > -1) {
          t.immagini.push(i);
          let cc = i.cartella;
          if (cc.indexOf('-') > -1) {
            cc = cc.substring(cc.indexOf('-') + 1, cc.length);
          }
          // console.log(cc);
          if (i.immagine && i.immagine.toUpperCase().indexOf('COVER_') > -1) { //  && cc === t.album) {
              numeroImmagine = c;
          } else {
            if (cc || (i && i.immagine && i.immagine.indexOf('.gif') > -1)) {
              if (t.inizioImmagini === -1) {
                t.inizioImmagini = c;
              }
              t.quanteImmagini++;
            }
          }
          c++;
        }
        // }
      });
      // console.log(t.immagini);
      t.utility.scriveDebug(t, 'Carico brano normale. 9... Immagini ' + t.quanteImmagini);
      t.utility.scriveDebug(t, 'Carico brano normale. 9.2.. Immagine COVER ' + numeroImmagine);
  
      if (numeroImmagine === -1) {
        t.immagineBrano = '../assets/immagini/looWPIcon.png';
      }
      // console.log(t.immagini, numeroImmagine, t.inizioImmagini, t.quanteImmagini, t.immagineBrano);
  
      const r = Math.floor(Math.random() * (t.quanteImmagini - t.inizioImmagini + 1) + t.inizioImmagini);
      // console.log(r);
  
      if (t.immagini && t.immagini[r] && t.immagini[r].immagine) {
        if (t.immagini[r].immagine.indexOf('.gif') === -1) {
          t.appoSfondo = t.urlImmagine + 'ImmaginiMusica/' + t.artista + '/' +
            t.immagini[r].cartella + '/' + t.immagini[r].immagine;
        } else {
          t.appoSfondo = t.urlImmagine + 'Gifs/' + t.artista + '/' + t.immagini[r].immagine;
        }
        // console.log(t.appoSfondo);
  
        setTimeout(() => {
          t.immagineSfondo = t.appoSfondo;
        }, 100);
      }
  
      if (t.modalitaYouTube === 'S' && 
        t.artista.toUpperCase().indexOf('CARTONI') === -1 &&
        t.artista.toUpperCase().indexOf('DEMENZ') === -1 &&
        t.artista.toUpperCase().indexOf('3MICA') === -1 &&
        t.artista.toUpperCase().indexOf('3ANGELICA') === -1
        ) {
        t.ytComponent.prendeVideoYouTube(this, 'N');
      } else {
        t.staCaricandoVideo = false;
      }
  
      // console.log(t.immagineSfondo);
  
      t.pauseTimer();
  
      t.utility.scriveDebug(t, 'Carico brano normale. 16');
  
      /* if (t.staSuonando === true) {
        if (!t.staCaricandoVideo) {
          t.audio.play();
        }
        t.startTimer();
        if (t.cicla === false) {
          t.startTimerImmagine();
        }
      } */
  
      t.utility.scriveDebug(t, 'Carico brano normale. 17');
  
      if (numeroImmagine > -1) {
        const nome = t.apiService.ritornaUrlImmagine() + 'ImmaginiMusica/' + t.artista + '/' +
          t.immagini[numeroImmagine].cartella + '/' + t.immagini[numeroImmagine].immagine;
  
        t.immagineBrano = t.effettuaReplace(nome, ' ', '%20');         
        
        console.log('Immagine brano 2: ', t.immagineBrano);

        if (t.deviceGirante === 'Android') {
          t.utility.scriveImmagineSeNonEsiste(t, t.artista, t.immagini[numeroImmagine].cartella, t.immagini[numeroImmagine].immagine, t.immagineBrano);
        }
    
        // console.log(t.apiService.ritornaUrlImmagine() + 'Immagini/' + t.artista + '/', t.immagini[numeroImmagine], t.immagineBrano);
      }
      // console.log(t.immagini);
      // console.log(t.immagineBrano);
  
      if (t.cicla === true) {
        t.startTimerImmagine();
      }
  
      localStorage.setItem('numero_brano', t.numeroBrano.toString());
  
      t.utility.scriveDebug(t, 'Carico brano normale. 18... Fine');
              
      t.impostaBellezza();
  
      t.caricaDettaglioArtista('N');
  
      // t.utility.apreTree(this);
      // t.apreAlbero = !t.apreAlbero;
  
      // t.impostaBellezza();
      // console.log(datiCanzone, t.pathBrano, t.immagini);    
  }
}