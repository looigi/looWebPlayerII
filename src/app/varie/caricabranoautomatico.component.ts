import { AfterViewInit, Injectable, OnChanges, OnInit } from "@angular/core";
import {throwError as observableThrowError, Observable} from 'rxjs';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { map } from "rxjs/operators";
import { ComponentFile } from "./files";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class CaricaBranoAutomaticoComponent implements OnInit, AfterViewInit, OnChanges {
  /* imms;
  volteAscoltata;
  numeroBrano;
  quantiBrani;
  artista;
  estensioneBrano;
  album;
  anno;
  traccia;
  dataBrano;
  dimensione;
  testo;
  testoTradotto;
  pathBrano;
  tipo;

  constructor(
      public utility: UtilityComponent,
  ) {}

  ngOnInit() {
      
  }

  ngOnChanges() {

  }

  ngAfterViewInit() {

  }

  caricaBrano(t) {
    t.scriveDebug('Carico brano automatico. Inizio');

    t.titoloBranoAutomatico = '';
    this.artista = '';
    this.album = '';

    t.scriveDebug('Carico brano automatico. 1... idBrano: ' + t.numeroBrano);
    t.scriveDebug('Carico brano automatico. 1.5... Connesso: ' + t.isConnected);

    if (t.deviceGirante === 'Android' && t.branoPresenteSuSD) {
      // Il brano è già stato scaricato... Inutile riprenderlo
    } else {
      const params = {
        NumeroBrano: t.numeroBrano
      };

      if (t.isConnected) {
        t.scriveDebug('Carico brano automatico. 1.75... Ritorna brano: ' + params.NumeroBrano);
        t.apiService.ritornaBrano(
          params
        ).map(response => response.text())
        .subscribe(
          data => {
            t.scriveDebug('Carico brano automatico. 1.9...');
            if (data) {
              const data2 = t.apiService.prendeSoloDatiValidi(data);
              // console.log(data2);

              t.scriveDebug('Carico brano automatico. 2... Ritornato brano...');
          
              if (data2.indexOf('ERROR:') === -1) {
                const dati = data2.split('|');
                const datiCanzone = dati[0].split(';');
                this.imms = dati[1].split('§');
                const datiCanzoneUlteriori = dati[2].split(';');
                // console.log(datiCanzone);
                
                this.volteAscoltata = +datiCanzoneUlteriori[0];
    
                this.numeroBrano = +datiCanzone[0];
                this.quantiBrani = +datiCanzone[1];
                t.titoloBranoAutomatico = datiCanzone[5];
                this.artista = datiCanzone[3];
                this.estensioneBrano = datiCanzone[8];
                this.album = datiCanzone[4];
                this.anno = datiCanzone[6];
                this.traccia = datiCanzone[7];
                this.dataBrano = datiCanzone[9];
                this.dimensione = datiCanzone[10];
    
                if (this.traccia.length === 1) {
                  this.traccia = '0' + this.traccia;
                }
                for (let i = this.anno.length + 1; i <= 4; i++) {
                  this.anno = '0' + this.anno;
                }
                // t.impostaBellezza();
    
                this.testo = t.sistemaTesto(datiCanzoneUlteriori[2]);
                if (this.testo === '') {
                  this.testo = datiCanzone[3].toUpperCase() + '<br />' + datiCanzone[5] + '<br /><br />Nessun testo rilevato';
                }
                this.testoTradotto = t.sistemaTesto(datiCanzoneUlteriori[3]);
                if (this.testoTradotto === '') {
                  this.testoTradotto = datiCanzone[3].toUpperCase() + '<br />' + datiCanzone[5] + '<br /><br />Nessun testo rilevato';
                }
                // console.log(t.testo);
                // console.log(t.testoTradotto);
    
                t.scriveDebug('Carico brano automatico. 3...');
            
                if (this.estensioneBrano.indexOf('.') > -1) {
                  this.estensioneBrano = this.estensioneBrano.substring(this.estensioneBrano.indexOf('.'), this.estensioneBrano.length);
                }
    
                t.scriveDebug('Carico brano automatico. 4...');
            
                this.pathBrano = t.apiService.ritornaUrlWS() + 'MP3/' + 
                this.artista + '/' + this.anno + '-' + this.album + '/' + 
                this.traccia + '-' + t.titoloBranoAutomatico + this.estensioneBrano;
                this.tipo = 'audio/mpeg';
                if (t.titoloBranoAutomatico.toUpperCase().indexOf('.MP3') > -1)  {
                  t.titoloBranoAutomatico = t.titoloBranoAutomatico.replace('.mp3', '');
                  this.tipo = 'audio/mpeg';
                }
                if (t.titoloBranoAutomatico.toUpperCase().indexOf('.WMA') === -1)  {
                  t.titoloBranoAutomatico = t.titoloBranoAutomatico.replace('.wma', '');
                  this.tipo = 'audio/x-ms-wma';
                }
                while (this.pathBrano.indexOf(' ') > -1) {
                  this.pathBrano = this.pathBrano.replace(' ', '%20');
                }
    
                const cartelletta = 'LooigiSoft';
                const titolone = 'looWebPlayer/Brani/' + this.artista + '/' + this.anno + '-' + this.album + '/' + this.traccia + '-' + t.titoloBranoAutomatico + this.estensioneBrano;
                t.scriveDebug('Carico brano automatico. Titolo: ' + titolone);

                if (t.deviceGirante === 'Android') {
                  ComponentFile.percorsoFileSD = '';
                  t.file.downloadBrano(t, this.pathBrano, cartelletta, titolone).then((Ritorno) => {
                    t.caricatoProssimoBrano = this.numeroBrano;
                    t.scriveDebug('Carico brano automatico. Effettuato download: ' + this.pathBrano);
                  });
                } else {
                  ComponentFile.percorsoFileSD = t.pathBrano;
                }
              } else {
                t.scriveDebug('Carico brano automatico. 19... ' + data2);
                t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data2, true);
              }
            } else {
              t.scriveDebug('Carico brano automatico. 20... ' + data);
              t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data, true);
            }
          },
          (error) => {
            if (error instanceof Error) {
              t.utility.visualizzaMessaggio(this, 'Carica Brano: ' + error.message, true);
            }
          }
        );
      } else {
        t.scriveDebug('Non riesco a leggere le informazioni sul brano successivo per mancanza di rete');
      }
    }
  }

  settaVariabili(t) {
    t.imms = this.imms;
    t.volteAscoltata = this.volteAscoltata;
    t.numeroBrano = this.numeroBrano;
    t.quantiBrani = this.quantiBrani;
    t.titoloBrano = t.titoloBranoAutomatico;
    t.artista = this.artista;
    t.estensioneBrano = this.estensioneBrano;
    t.album = this.album;
    t.anno = this.anno;
    t.traccia = this.traccia;
    t.dataBrano = this.dataBrano;
    t.dimensione = this.dimensione;
    t.testo = this.testo;
    t.testoTradotto = this.testoTradotto;
    t.pathBrano = this.pathBrano;
    t.tipo = this.tipo;  
    t.posizioneBrano = 0;
  }
  
  resettaErrori(t) {
    t.apiService.resettaErrori();
  } */

    imms;
    volteAscoltata;
    numeroBrano;
    quantiBrani;
    artista;
    estensioneBrano;
    album;
    anno;
    traccia;
    dataBrano;
    dimensione;
    testo;
    testoTradotto;
    pathBrano;
    tipo;
    contatore = 0;
    tagsBrano;
  
    constructor(
        public utility: UtilityComponent,
    ) {}
  
    ngOnInit() {
        
    }
  
    ngOnChanges() {
  
    }
  
    ngAfterViewInit() {
  
    }
  
    resettaErrori(t) {
      t.apiService.resettaErrori();
    }
  
    public caricaBrano(t) {
      this.contatore++;
      t.utility.scriveDebug(t, 'Carico brano automatico. Inizio. Prova ' + this.contatore + '/5');
  
      t.titoloBranoAutomatico = '';
      this.artista = '';
      this.album = '';
  
      t.utility.scriveDebug(t, 'Carico brano automatico. 1... idBrano: ' + t.numeroBrano);
      t.utility.scriveDebug(t, 'Carico brano automatico. 1.5... Connesso: ' + t.isConnected);
  
      if (t.intervalDurata) {
        clearInterval(t.intervalDurata);
      }
  
      if (t.deviceGirante === 'Android' && t.branoPresenteSuSD) {
        t.utility.scriveDebug(t, 'Carico brano automatico. Il brano è già stato scaricato... Inutile riprenderlo');
        
        t.titoloBranoAutomatico = t.titoloBrano;
      } else {
        const params = {
          NumeroBrano: t.numeroBrano
        };
  
        if (t.isConnected) {
          t.utility.scriveDebug(t, 'Carico brano automatico. 1.75... Ritorna brano: ' + params.NumeroBrano);
          t.apiService.ritornaBrano(
            t.idUtenza,
            params,
            this
          ).map(response => t.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              t.utility.scriveDebug(t, 'Carico brano automatico. 1.9...');
              if (data) {
                const data2 = t.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
  
                t.utility.scriveDebug(t, 'Carico brano automatico. 2... Ritornato brano...');
            
                if (data2.indexOf('ERROR:') === -1) {
                  this.contatore = 0;
  
                  const dati = data2.split('|');
                  const datiCanzone = dati[0].split(';');
                  this.imms = dati[1].split('§');
                  const datiCanzoneUlteriori = dati[2].split(';');
                  // console.log(datiCanzone);
                  
                  this.volteAscoltata = +datiCanzoneUlteriori[0];
      
                  this.numeroBrano = +datiCanzone[0];
                  this.quantiBrani = +datiCanzone[1];
                  t.titoloBranoAutomatico = datiCanzone[5];
                  this.artista = datiCanzone[3];
                  this.estensioneBrano = datiCanzone[8];
                  this.album = datiCanzone[4];
                  this.anno = datiCanzone[6];
                  this.traccia = datiCanzone[7];
                  this.dataBrano = datiCanzone[9];
                  this.dimensione = datiCanzone[10];
      
                  if (this.traccia.length === 1) {
                    this.traccia = '0' + this.traccia;
                  }
                  for (let i = this.anno.length + 1; i <= 4; i++) {
                    this.anno = '0' + this.anno;
                  }
                  // t.impostaBellezza();
      
                  this.testo = t.sistemaTesto(datiCanzoneUlteriori[2]);
                  if (this.testo === '') {
                    this.testo = datiCanzone[3].toUpperCase() + '<br />' + datiCanzone[5] + '<br /><br />Nessun testo rilevato';
                  }
                  this.testoTradotto = t.sistemaTesto(datiCanzoneUlteriori[3]);
                  if (this.testoTradotto === '') {
                    this.testoTradotto = datiCanzone[3].toUpperCase() + '<br />' + datiCanzone[5] + '<br /><br />Nessun testo rilevato';
                  }
                  // console.log(t.testo);
                  // console.log(t.testoTradotto);
      
                  t.utility.scriveDebug(t, 'Carico brano automatico. 3...');
              
                  if (this.estensioneBrano.indexOf('.') > -1) {
                    this.estensioneBrano = this.estensioneBrano.substring(this.estensioneBrano.indexOf('.'), this.estensioneBrano.length);
                  }
      
                  t.utility.scriveDebug(t, 'Carico brano automatico. 4...');
              
                  this.pathBrano = t.apiService.ritornaUrlMP3() + 'MP3/' + 
                  this.artista + '/' + this.anno + '-' + this.album + '/' + 
                  this.traccia + '-' + t.titoloBranoAutomatico + this.estensioneBrano;
                  this.tipo = 'audio/mpeg';
                  if (t.titoloBranoAutomatico.toUpperCase().indexOf('.MP3') > -1)  {
                    t.titoloBranoAutomatico = t.titoloBranoAutomatico.replace('.mp3', '');
                    this.tipo = 'audio/mpeg';
                  }
                  if (t.titoloBranoAutomatico.toUpperCase().indexOf('.WMA') === -1)  {
                    t.titoloBranoAutomatico = t.titoloBranoAutomatico.replace('.wma', '');
                    this.tipo = 'audio/x-ms-wma';
                  }
                  while (this.pathBrano.indexOf(' ') > -1) {
                    this.pathBrano = this.pathBrano.replace(' ', '%20');
                  }
    
                  // t.titoloBranoAutomatico = t.titoloBrano;
                  t.scrollaTesto('txtTitoloBranoAutomatico', t.titoloBranoAutomatico, 0);
        
                  const cartelletta = 'LooigiSoft';
                  const titolone = 'looWebPlayer/Brani/' + this.artista + '/' + this.anno + '-' + this.album + '/' + this.traccia + '-' + t.titoloBranoAutomatico + this.estensioneBrano;
                  t.utility.scriveDebug(t, 'Carico brano automatico. Titolo: ' + titolone);
        
                  this.prendeTagsBrano(t);
  
                  if (t.deviceGirante === 'Android') {
                    ComponentFile.percorsoFileSD = '';
                    t.file.downloadBrano(t, this.pathBrano, cartelletta, titolone).then((Ritorno) => {
                      if (Ritorno === 'OK') {
                        t.caricatoProssimoBrano = this.numeroBrano;
                        t.utility.scriveDebug(t, 'Carico brano automatico. Effettuato download: ' + this.pathBrano);
                      } else {
                        t.utility.scriveDebug(t, 'Errore nel DL Auto. Provo a prendere un altro brano');
                        alert('Errore nel DL Auto: Provo con altro brano');
                        t.scaricaProssimoBranoInAutomatico();
                      }
                    });
                    /* const si = setInterval(() => {
                      if (ComponentFile.percorsoFileSD !== '') {
                        if (ComponentFile.percorsoFileSD !== 'Download interrotto') {
                          clearInterval(si);
  
                          t.caricatoProssimoBrano = this.numeroBrano;
                          t.utility.scriveDebug(t, 'Carico brano automatico. Effettuato download: ' + this.pathBrano);
                        } else {
                          t.utility.scriveDebug(t, 'Carico brano automatico. Download bloccato');
                          t.caricatoProssimoBrano = -1;
                        }
                      }
                    }, 100) */
                  } else {
                    ComponentFile.percorsoFileSD = t.pathBrano;
                  }
                } else {
                  t.utility.scriveDebug(t, 'Carico brano automatico. 19... ' + data2);
                  if (this.contatore <= 5) {
                    // t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data2, true);
                    t.utility.scriveDebug(t, 'Carico brano automatico. 21... Ricarico altro brano in maniera automatica');
                    setTimeout(() => {
                      t.scaricaProssimoBranoInAutomatico();
                    }, 10);
                  } else {
                    t.utility.scriveDebug(t, 'Carico brano automatico. 22... Blocco ricaricamento');
                  }
                }
              } else {
                t.utility.scriveDebug(t, 'Carico brano automatico. 20... Struttura vuota ritornata');
                if (this.contatore <= 5) {
                  t.utility.scriveDebug(t, 'Carico brano automatico. 21... Ricarico altro brano in maniera automatica');
                  setTimeout(() => {
                    t.scaricaProssimoBranoInAutomatico();
                  }, 10);
                } else {
                  t.utility.scriveDebug(t, 'Carico brano automatico. 22... Blocco ricaricamento');
                }
                // t.utility.visualizzaMessaggio(this, 'Carico brano: ' + data, true);
              }
            },
            (error) => {
              // if (error instanceof Error) {
                t.utility.scriveDebug(t, 'Carico brano automatico. Errore Ritorna brano: ' + JSON.stringify(error));
                if (this.contatore <= 5) {
                  t.utility.scriveDebug(t, 'Carico brano automatico. Errore... Ricarico altro brano in maniera automatica');
                  setTimeout(() => {
                    t.scaricaProssimoBranoInAutomatico();
                  }, 10);
                } else {
                  t.utility.scriveDebug(t, 'Carico brano automatico. 22... Blocco ricaricamento');
                }
              // t.utility.visualizzaMessaggio(this, 'Carica Brano: ' + error.message, true);
              // }
            }
          );
        } else {
          t.utility.scriveDebug(t, 'Non riesco a leggere le informazioni sul brano successivo per mancanza di rete');
        }
      }
    }
  
    prendeTagsBrano(t) {
      const params = {
        NumeroBrano: this.numeroBrano
      };
      this.tagsBrano = new Array();
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
                    this.tagsBrano.push(tt);
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
  
    settaVariabili(t) {
      t.numeroBrano = this.numeroBrano; // t.caricatoProssimoBrano;
      t.imms = this.imms;
      t.volteAscoltata = this.volteAscoltata;
      t.quantiBrani = this.quantiBrani;
      t.titoloBrano = t.titoloBranoAutomatico;
      t.artista = this.artista;
      t.estensioneBrano = this.estensioneBrano;
      t.album = this.album;
      t.anno = this.anno;
      t.traccia = this.traccia;
      t.dataBrano = this.dataBrano;
      t.dimensione = this.dimensione;
      t.testo = this.testo;
      t.testoTradotto = this.testoTradotto;
      t.pathBrano = this.pathBrano;
      t.tipo = this.tipo;  
      t.posizioneBrano = 0;
      t.tagsBrano = this.tagsBrano;
      t.numeroBranoAttuale = this.numeroBrano;
    }
}