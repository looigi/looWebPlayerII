import { Injectable, OnChanges, OnInit } from "@angular/core";
// import { BackgroundMode } from "@awesome-cordova-plugins/background-mode/ngx";
// import { BackgroundMode } from "@awesome-cordova-plugins/background-mode/ngx";
import { ApiService } from "../services/api2.service";
import { CaricaBranoComponent } from "./caricabrano.component";
import { ComponentFile } from "./files";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class GestioneAndroidComponent implements OnInit, OnChanges {
  frmPrincipale;
  staLeggendo;

  constructor(
      public utility: UtilityComponent,
      private caricaBrano: CaricaBranoComponent,
      private apiService: ApiService,
      private file: ComponentFile,
      // private backgroundMode: BackgroundMode,
    ) {        
      /* this.backgroundMode.enable();
      this.backgroundMode.setDefaults({ title: "looWebPlayer", text: 'looWebPlayer'});
      this.backgroundMode.on('activate').subscribe(() => {
          this.backgroundMode.disableWebViewOptimizations();
      }); */      
    }

  ngOnInit() {            
  }

  ngOnChanges() {

  }

  iniziaTutto(t) {
    this.frmPrincipale = t;
    if (t.isConnected) {
        // Carica brani da web
        this.utility.caricaJsonBrani(t).then((Ritorno: string) => {
            const rit = Ritorno.substring(0, 5);
            // this.utility.scriveDebug(t, 'Ritorno lettura dei brani: ' + rit);
            if (rit !== 'ERROR') {
              let ok = true;

              try {
                t.datiJSON = JSON.parse(Ritorno);
              } catch (e) {
                ok = false;
                this.apiService.eliminaJSON(t, t.idUtenza)
                .map(response => this.apiService.controllaRitorno(response))
                  .subscribe(
                    data => {
                      alert('Problemi nel leggere il json dei brani. Struttura non valida.\nRiavviare l\'applicazione');
                    }
                );
              }
              
              if (ok) {
                this.utility.prosegueCaricaJsonBrani2(t, false);

                this.leggeFileBraniLocali(t);

                this.utility.filtraBrani(t);
        
                t.impostaBellezza();

                t.leggeTags();

                this.caricaBranoDaID(t);

                t.startTimerScritte();

                t.caricamentoInCorso = false;
              }
            } else {
                this.utility.scriveDebug(t, 'Problemi nella lettura dei brani: ' + Ritorno);
            }
        });
    } else {
        // Carica brani locali
        this.caricaJsonBraniDaLocale(t);
    }
  }

  caricaJsonBraniDaLocale(t) {
      this.utility.scriveDebug(t, 'Siamo senza connessione. Provo a cercare il file dei brani in locale');
      this.file.checkIfFileExists(this, 'LooigiSoft', 'looWebPlayer/jsonBrani.json').then(Ritorno => {
        this.utility.scriveDebug(t, 'Esiste file locale jsonBrani.json: ' + Ritorno);
        if (Ritorno === 'SI') {
          setTimeout(() => {
            const path = ComponentFile.pathSD + '/LooigiSoft/looWebPlayer/jsonBrani.json'
            this.file.readFile(this, path, 2).then((Ritorno: string) => {
              try {
                t.datiJSON = JSON.parse(Ritorno);   
                
                this.utility.prosegueCaricaJsonBrani2(t, false);

                this.leggeFileBraniLocali(t);

                this.utility.filtraBrani(this);
        
                t.impostaBellezza();

                t.leggeTags();

                this.caricaBranoDaID(t);

                t.startTimerScritte();

                t.caricamentoInCorso = false;
              } catch (e) {
                this.utility.scriveDebug(t, 'Problemi sul dati JSON');
                return;
              }      
            });
          }, 100);
        }
      });
    }

    caricaBranoDaID(t) {        
      if (t.numeroBrano === 0) {
        t.numeroBrano = 1;
        t.numeroBranoAttuale = 1;
        this.utility.scriveDebug(t, 'Caricato tutto 3. Carico brano ' + t.numeroBrano);
        this.caricaBrano.caricaBrano(t);
        t.ascoltata++;
        t.ascoltati.push(t.numeroBrano);
      } else {
        this.utility.scriveDebug(t, 'Caricato tutto 4. Carico brano ' + t.numeroBrano);
        this.caricaBrano.caricaBrano(t);
        t.ascoltata++;
        t.ascoltati.push(t.numeroBrano);
        // console.log(this.variabiliGlobali.urlWS, this.variabiliGlobali.urlPerUpload);
      }  
    }

    leggeFileBraniLocali(t) {
        const indice = 2;
        ComponentFile.fileJSON[indice] = '';
        const path = ComponentFile.pathSD + '/LooigiSoft/looWebPlayer/jsonBraniLocali.json'
        // alert('Carico files brani locali ' + path);
        this.file.readFile(this, path, indice).then((Ritorno: string) => {
            if (Ritorno.indexOf('ERROR: ') > -1) {
                this.file.prendeTuttiIFilesInLocale(this, indice).then((Ritorno) => {
                    this.sistemaStrutturaBraniLocali(t, true);
                });        
            } else {
                t.braniSD = Ritorno;
            
                ComponentFile.filesInMemoria = new Array();
                const b = Ritorno.split('§');
                this.utility.scriveDebug(t, 'Letto file brani locali: Lungehzza ritorno: ' + Ritorno.length);
                this.utility.scriveDebug(t, 'Letto file brani locali: Lungehzza array: ' + b.length);
                b.forEach(element => {
                ComponentFile.filesInMemoria.push(element);
                });
                // alert('Contenuto file: ' + Files.fileJSON);
                // alert('Struttura file: ' + Files.filesInMemoria.length);
                this.utility.scriveDebug(t, 'Letto file brani locali: Brani caricati ' + ComponentFile.filesInMemoria.length);
            
                this.sistemaStrutturaBraniLocali(t, false);
            }
        });
    }

    sistemaStrutturaBraniLocali(t, salva) {
        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: ' + ComponentFile.filesInMemoria.length);
    
        let id = 90000;
        let brani = '';
        let q = 0;
        const b = new Array();
        ComponentFile.filesInMemoria.forEach(element => {
          brani += element + '§';
    
          let nome = '';
          let traccia = '';
          let path = '';
          let estensione = '';
          const nn = element.split('/');
    
          let artista = 'Sconosciuto';
          let album = 'Sconosciuto';
    
          if (element.indexOf('LooigiSoft') > -1) {
            artista = nn[3];
            // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: Tutto ' + nn);
            // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: Artista ' + artista);
            if (nn[4].indexOf('-') > -1) {
              const alb = nn[4].split('-');
              album = alb[1];
            } else {
              album = nn[4];
            }
          }
          // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: Artista ' + album);
          nn.forEach(element2 => {
            if (element2.toUpperCase().indexOf('.MP3') > -1 || element2.toUpperCase().indexOf('.WMA') > -1 && element2.text !== '') {
              nome = element2;
              path = element;
              if (nome.indexOf('-') > -1) {
                const nn = nome.split('-');
                traccia = nn[0];
                nome = '';
                for (let i = 1; i < nn.length; i++) {
                  nome += nn[i];
                }
              }
              if (nome.indexOf('.') > -1) {
                for (let i = nome.length - 1; i> 0; i--) {
                  if (estensione === '') {
                    if (nome.substring(i, i + 1) === '.') {
                      estensione = nome.substring(i, nome.length);
                      nome = nome.replace(estensione, '');
                    }
                  }
                }
              }
            }
          });
          if (nome !== '' && path !== '') {
            const bb = { Artista: artista, Album: album, Ascoltata: 0, Estensione: estensione, id: id, Stelle: 0, 
              path: path, Text: nome, Traccia: traccia !== '' ? traccia : '00' };
            // this.utility.scriveDebug(t, 'Aggiungo brano locale. ID:' + id + ' Path: ' + path);
            // alert(nome + ' - ' + element);
            // alert(JSON.stringify(bb));
            id++;
            q++;
            b.push(bb);
          }
        });
        
        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Aggiunti ' + q);
    
        if (salva === true) {
          this.file.writeFile(this, 9, 'LooigiSoft', 'looWebPlayer/jsonBraniLocali.json', JSON.stringify(brani)).then((Ritorno) => {
            this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Scrittura file brani locali:' + Ritorno);
          });
        }

        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Righe prima della modifica: ' + t.datiJSON.length);
        // const n = { text: 'Brani SD', collapsed: true, children: [{ Anno: '0000', collapsed: true, text: 'Locale', children: b }] };
        // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Righe interne struttura: ' + b.length);
    
        let trovato = false;
        let nonTrovati = new Array();
        q = 0;
    
        b.forEach(branoSuSD => {
          trovato = false;
          if (branoSuSD.Artista !== 'Sconosciuto') {
            // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: Cerco ' + branoSuSD.Artista + ' - ' + branoSuSD.Album + ' - ' + branoSuSD.Text);
            
            if (trovato === false) {
              t.datiJSON.forEach(element => {
                if (trovato === false && element.text === branoSuSD.Artista) {
                  // this.utility.scriveDebug(t, 'Artista: ' + element.text + ' - ' + branoSuSD.Artista);
                  const albums = element.children;
                  albums.forEach(element2 => {
                    if (trovato === false && element2.text === branoSuSD.Album) {
                      // this.utility.scriveDebug(t, 'Album: ' + element2.text + ' - ' + branoSuSD.Album);
                      const brani = element2.children;
                      brani.forEach(element3 => {
                        if (trovato === false && element3.Text === branoSuSD.Text) {
                          // this.utility.scriveDebug(t, 'Brano: ' + element3.Text + ' - ' + branoSuSD.Text);
                          // this.utility.scriveDebug(t, 'TROVATO:  ' + element3.Text);
                          element3.locale = true;
                          trovato = true;
                          q++;
                        }
                      });
                    }            
                  });
                }
              });
            }
          }
    
          if (!trovato) {
            // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali: NON Trovato');
            nonTrovati.push(branoSuSD);
            /* let ce = false;
            this.datiJSON.forEach(element => {
              if (ce === false && element.text === 'Brani SD') {
                ce = true;
              }
            });
            // this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Rilevati nella struttura: ' + ce); */
          }
        });
        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Righe Aggiornate: ' + q);
        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Righe NON trovate: ' + nonTrovati.length);
    
        const n = { text: 'Brani SD', collapsed: true, children: [{ Anno: '0000', collapsed: true, text: 'Locale', children: nonTrovati }] };
        try {
          t.datiJSON.push(n);
        } catch (e) {
          this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Errore nel riempimento della struttura: ' + JSON.stringify(e));
        }
        this.utility.scriveDebug(t, 'Sistemazione struttura brani locali. Righe dopo la modifica: ' + t.datiJSON.length);
    }
    /*
        // prende brano random di quelli già scaricati
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
        // alert(pathImmagine);
    
        // this.caricaBrano.prosegueCaricamento(this);
    
        t.imms = new Array();
        t.scritte = new Array();
        this.caricaBrano.prendeScritte(this);
    }        */

    scaricaProssimoBranoInAutomatico(t) {
        t.scaricatoAutomaticamente = true;
        this.utility.scriveDebug(t, 'Avanti brano, cerco nuovo');
        t.numeroBrano = t.prendeNumeroProssimoBrano(1);
        this.utility.scriveDebug(t, 'Avanti brano, prendo nuovo: ' + t.numeroBrano);
        t.caricaBranoAutomatico.resettaErrori(t);
        this.utility.scriveDebug(t, 'Avanti brano, Resettati errori');
        t.caricaBranoAutomatico.caricaBrano(t);
    }    
}