import { DatePipe } from "@angular/common";
import { Injectable, OnInit } from "@angular/core";
import { ConnectionServiceModule } from "ng-connection-service";
import { Observable } from "rxjs";
import { ApiService } from "../services/api2.service";
import { HttpService } from "../services/httpclient.service";
import { ComponentFile } from "./files";
import {throwError as observableThrowError} from 'rxjs';

declare var cordova: any;
declare var device: any;

@Injectable()
export class UtilityComponent implements OnInit {
  static haEseguitoGiaIlCostruttore = false;
  static TimeOutConnessione = 10000;

  constructor(
    private datePipe: DatePipe,
    private file: ComponentFile,
    private apiService: ApiService,
    private http: HttpService,  
  ) {

  }

  ngOnInit() {

  }

  parsaTesto(form, cosa) {
    console.log('Comando vocale da parsare: ', cosa);

    if (!cosa || cosa === undefined || cosa === 'undefined' || cosa === '') {
      return;
    }
    
    switch(cosa.toUpperCase().trim()) {
      case 'PLAY':
        if (form.staSuonando === false) {
          form.scriveDebug('Arrivato comando vocale play');
          form.play(true);
        }
        break;
      case 'STOP':
        if (form.staSuonando === true) {
          form.scriveDebug('Arrivato comando vocale stop');
          form.play(false);
        }
        break;
      case 'INDIETRO':
        form.scriveDebug('Arrivato comando vocale indietro');
        form.indietroBrano();
        break;
      case 'AVANTI':
        form.scriveDebug('Arrivato comando vocale avanti');
        form.avantiBrano();
        break;
    }
  }

  filtraBrani(t) {
      t.maxID = 0;
      let filtro = t.filtroImpostato;
      if (filtro === ';') { filtro = ''; }

      // console.log(t.datiJSON);
      t.utility.scriveDebug(t, 'Filtra brani - Numero righe: ' + t.datiJSON.length);
      t.utility.scriveDebug(t, 'Filtra brani - Filtro: ' + filtro);
      t.utility.scriveDebug(t, 'Filtra brani - Stelle: ' + t.consideraStelle);
      t.utility.scriveDebug(t, 'Filtra brani - Mai Votate: ' + t.maiVotate);
      t.utility.scriveDebug(t, 'Filtra brani - Numero Stelle: ' + t.numeroStelle);
      t.utility.scriveDebug(t, 'Filtra brani - Tags Ricerca: ' + JSON.stringify(t.tagsRicerca));
      t.utility.scriveDebug(t, 'Filtra brani - Esclusioni: ' + t.esclusioni);

      // if ((!filtro || filtro === null || filtro === '') && !t.eliminaMamma && !t.consideraStelle && t.canzoniMamma === false) {
      //     t.braniFiltrati = t.datiJSON;
      // } else {
          t.braniFiltrati = new Array();
          t.quantiBraniFiltrati = 0;

          if (!filtro) {
              filtro = '';
          }
          if (filtro.indexOf(';') === -1) {
              filtro += ';';
          }
      
          if (!t.esclusioni) {
            t.esclusioni = '';
          }

          if (t.canzoniMamma === true) {
              filtro = 'MP3MIC;MP3ANGEL;' + filtro;
          }
          // console.log('Filtro', filtro);
  
          const f = filtro.split(';');
          const esclusioni = t.esclusioni.split(';');

          if (t.datiJSON) {
              t.utility.scriveDebug(t, 'Filtra brani - 1');
              t.datiJSON.forEach(element => {
                  let ok = false;
                  let tr: any = undefined;
                  let fai = true;
          
                  if (t.eliminaMamma === true) {
                      // console.log('Controllo', element.text);
                      if (element.text.toUpperCase().indexOf('MP3MIC') > -1 || element.text.toUpperCase().indexOf('MP3ANGEL') > -1) {
                          fai = false;
                          // console.log('Skippo', element.text);
                      }
                  }
                  if (t.canzoniLocali === true) {
                      if (element.text !== 'Brani SD') {
                          fai = false;
                      }
                  }

                  if (fai) {
                      // console.log('Vado ', element.text)
                      element.children.forEach(element2 => {
                          // console.log(element2);
                          element2.children.forEach(element3 => {
                          // console.log(element2);
                              // if (t.eliminaMamma || t.consideraStelle) {
                                  if (this.controllaFiltro(element.text + element2.text + element3.Text, f) === true) {
                                      let ok1 = true;
                      
                                      // const numeroStelleBrano = this.ritornaStelleBrano(t, element3.id, false);
                                      const numeroStelleBrano = element3.Stelle;
                                      // console.log('Passato filtro testo', element3.Text, numeroStelleBrano);
                      
                                      if (t.consideraStelle === true && t.maiVotate === false) {
                                          if (+t.numeroStelle > numeroStelleBrano) {
                                              // console.log(this.numeroStelle, element3, element3.Stelle);
                                              ok1 = false;
                                          }
                                      } else {
                                          // console.log(this.consideraStelle, this.maiVotate);
                                          if (t.consideraStelle === true && t.maiVotate === true) {
                                              // console.log(element3.Stelle);
                                              const locale = element3.locale;
                                              // const path = element3.path.toUpperCase();
                                              if (numeroStelleBrano > 0 || locale === true) {
                                                  ok1 = false;
                                              }
                                          }
                                      }

                                      if (ok1) {
                                          // console.log(element3, element3.Stelle);

                                          let q = 0;

                                          // const numeroArtista = 0;

                                          if (!tr) {
                                              const artista = {
                                                  children: undefined,
                                                  collapsed: true,
                                                  text: element.text,
                                                  // value: element.value
                                              }
                                              tr = artista;
                                              // numeroArtista = 0;
                                          // } else {
                                              // tr[numeroArtista] = artista;
                                          }

                                          if (!tr.children) {
                                              tr.children = new Array();
                                          }
                                          q = 0;
                                          let numeroAlbum = -1;
                                          if (tr.children) {
                                              tr.children.forEach(element4 => {
                                                  if (numeroAlbum === -1) {
                                                      if (element4.text === element2.text) {
                                                          numeroAlbum = q;
                                                      }
                                                  }
                                                  q++;
                                              });
                                          }
                                          let an = element2.Anno;
                                          if (!an || an === '') {
                                            an = '0000';
                                          }
                                          for (let i = an.length + 1; i <= 4; i++) {
                                            an = '0' + an;
                                          }
                              
                                          const album = {
                                              children: undefined,
                                              collapsed: true,
                                              text: element2.text,
                                              anno: an,
                                              // value: element2.value
                                          }
                                          if (numeroAlbum === -1) {
                                              tr.children.push(album);
                                              numeroAlbum = tr.children.length - 1;
                                          // } else {
                                              // tr.children[numeroAlbum] = album;
                                          }

                                          // console.log(numeroAlbum, tr);
                                          if (!tr.children[numeroAlbum].children) {
                                              tr.children[numeroAlbum].children = new Array();
                                          }

                                          // console.log(element3);
                                          let scrive = true;

                                          if (scrive) {
                                            // Controllo tags
                                            if (t.tagsRicerca.length > 0) {
                                              const tagsBrano = new Array();
                                              const dd = element3.Tags.split('§');
                                              dd.forEach(element => {
                                                if (element && element !== '') {
                                                  const d2 = element.split(';');
                                                  const tt = {
                                                    Progressivo: +d2[0],
                                                    idTag: +d2[1],
                                                    Tag: d2[2]
                                                  }
                                                  tagsBrano.push(tt);
                                                }
                                              });

                                              let quanti = 0;
                                              tagsBrano.forEach(element6 => {
                                                if (scrive) {
                                                  t.tagsRicerca.forEach(element5 => {
                                                    const ele = element5.replace("'", "").replace("'","").replace("\"", "").replace("\"","");
                                                    // console.log(element3.Text, element6.Tag, ele);
                                                    if (element6.Tag === ele) {
                                                      quanti++;
                                                    }
                                                  });
                                                }
                                              });
                                              if (quanti === 0) {
                                                tr = undefined;
                                                scrive = false;
                                              }
                                            }
                                            // Controllo tags

                                            if (scrive) {
                                              // Esclusioni
                                              if (esclusioni.length > 0) {
                                                const tutto = (element.text + element2.text + element3.Text).toUpperCase().trim();
                                                // console.log(tutto);
                                                esclusioni.forEach(element7 => {
                                                  if (scrive === true && element7 && element7 !== '') {
                                                    // console.log('Controllo esculsioni', tutto, element7.toUpperCase().trim());
                                                    if (scrive === true && tutto.indexOf(element7.toUpperCase().trim()) > -1) {
                                                      // console.log('Escludo', tutto, element7.toUpperCase().trim());
                                                      scrive = false;
                                                      tr = undefined;
                                                    }
                                                  }
                                                });
                                              }
                                              // Esclusioni
                                              if (scrive) {
                                                let tra = element3.Traccia;
                                                if (!tra || tra === '') {
                                                  tra = '00';
                                                }
                                                if (tra.length === 1) {
                                                  tra = '0' + tra;
                                                }
                                    
                                                tr.children[numeroAlbum].children.push({
                                                    id: element3.id,
                                                    text: element3.Text,
                                                    traccia: tra,
                                                    // value: element3.value,
                                                    stelle: element3.Stelle,
                                                    estensione: element3.Estensione,
                                                    ascoltata: +element3.Ascoltata,
                                                    locale: element3.locale === undefined ? false : element3.locale,
                                                    path: element3.path, // tr.text + '/' + album.anno + '-' + album.text + '/' + element3.Traccia + '-' + element3.Text + element3.Estensione
                                                    tags: element3.Tags
                                                });
                                                t.quantiBraniFiltrati++;
                                                ok = true;
                                              }
                                            }
                                          }
                                          // console.log(element3);
                                          // console.log(element3.Stelle);

                                          // this.ultimoFiltro += element3.value + ',';
                                      }
                                  }
                              // }
                          });
                      });
                  }
      
                  if (ok) {
                      // console.log(tr);
                      // const t: TreeviewItem = new TreeviewItem(tr);
                      // this.itemsCanzoniFiltrate.push(t);
                      if (tr) {
                        t.braniFiltrati.push(tr);
                      }
                  }          
              });
          }
      // }

      /* if (t.deviceGirante === 'Android') {
        t.file.writeFile(this, 4, 'LooigiSoft', 'looWebPlayer/TuttoILJSON.json', JSON.stringify(t.datiJSON)).then((Ritorno) => {
          t.utility.scriveDebug(t, 'Scritto file Tutto il JSON');
          t.file.writeFile(this, 4, 'LooigiSoft', 'looWebPlayer/BraniFiltrati.json', JSON.stringify(t.braniFiltrati)).then((Ritorno) => {
            t.utility.scriveDebug(t, 'Scritto file Brani Filtrati');
          });  
        });
      } */

      t.utility.scriveDebug(t, 'Filtra brani - Quanti Brani filtrati: ' + t.quantiBraniFiltrati);
      // t.quantiBraniFiltrati = this.contaBrani(t);
      t.utility.scriveDebug(t, 'Filtra brani - Brani filtrati: ' + t.braniFiltrati.length);
      // console.log(t.braniFiltrati);
      // this.creaHTMLBrani(t);
  }
  
  effettuaReplace(str, find, replace) {
      const escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      return str.replace(new RegExp(escapedFind, 'g'), replace);
  }

  creaMatrice(x, y, valore) {
      const m = new Array();
      for (let i = 0; i <= x; i++) {
        m.push(new Array());
        m[i][0] = false;
        for (let j = 1; j <= y + 1; j++) {
          m[i].push(valore);
        }
      }
      // console.log(m);
      return m;
  }

  controllaFiltro(daDove, cosa) {
      let ok = false;

      let ceFiltro = false;
      cosa.forEach(element => {
          if (element !== '') {
              ceFiltro = true;
          }
      });

      if (!ceFiltro) {
          return true;
      }
      // console.log('Filtro', daDove, cosa);

      cosa.forEach(element => {
          if (element && element !== '') {
              const ele = element.replace("'", "").replace("'","").replace("\"", "").replace("\"","").toUpperCase().trim();
              if (ok === false) {
                // console.log(daDove, ele);
                if (daDove.toUpperCase().indexOf(ele) > -1) {
                    // console.log(daDove, element);
                    ok = true;
                }
              }
          }
      });
  
      return ok;
  }
  
  ritornaStelleBrano(t, n, debug) {
      if (!t.datiJSON) {
          return;
      }

      let valore = -1;
      t.datiJSON.forEach(element => {
          if (valore === -1) {
              element.children.forEach(element2 => {
                  if (valore === -1) {
                      element2.children.forEach(element3 => {
                          if (valore === -1) {
                              if (element3.id === t.numeroBrano) {
                                  valore = element3.Stelle;
                              }
                          }
                      });
                  }
              });
          }
      });
      /* let r = t.datiJSON.filter(x => +x.id === +n); */
      /* if (r && r[0]) {
        valore = +r[0].B;
      } else {
        console.log('Nessuna bellezza rilevata per il brano ', n);
      } */
      
      return valore;
  }    

  visualizzaMessaggio(t, messaggio, errore) {
    if (errore === false) {
      t.coloreSfondoMessaggio = 'rgb(237, 255, 134)';
    } else {
      t.coloreSfondoMessaggio = 'rgb(255, 237, 134)';
    }
    t.messaggio = messaggio;
    t.messaggioVisualizzato = true;
    if (t.timerMessaggio) {
      clearInterval(t.timerMessaggio);
    }
    t.timerMessaggio = setInterval(() => {
      t.messaggioVisualizzato = false;
    }, 5000);
  }

  scriveImmagineSeNonEsiste(t, artista, album, nome, blob) {
    const indice = 1;
    ComponentFile.esisteFile[indice] = '';
    const cartellaJSON1 = 'LooigiSoft';
    const nomeFileJSON1 = 'looWebPlayer/Immagini/' + artista + '/' + album + '/' + nome;
    t.utility.scriveDebug(t, 'Esiste file immagine ' + nomeFileJSON1 + ' per scrittura');

    t.file.checkIfFileExists(t, indice, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
      t.utility.scriveDebug(t, 'Esiste file immagine ' + nomeFileJSON1 + ': ' + Ritorno);
      if (Ritorno !== 'SI') {
        t.file.writeFile(t, indice, 'LooigiSoft', 'looWebPlayer/Immagini/' + artista + '/' +
        album + '/' + nome, blob);
      }
    });;
    /* let q = 0;
    const t1 = setInterval(() => {
      if (ComponentFile.esisteFile[indice] !== '') {
        clearInterval(t1);
        if (ComponentFile.esisteFile[indice] === 'SI') {
        } else {
          t.file.writeFile(t, indice, 'LooigiSoft', 'looWebPlayer/Immagini/' + artista + '/' +
            album + '/' + nome, blob);
        }
      }
    }); */
  }

  leggeImmagineSeEsiste(t, artista, album, nome) {
    const indice = 2;
    ComponentFile.esisteFile[indice] = '';
    const cartellaJSON1 = 'LooigiSoft';
    const nomeFileJSON1 = 'looWebPlayer/Immagini/' + artista + '/' + album + '/' + nome;
    t.utility.scriveDebug(t, 'Esiste file immagine ' + nomeFileJSON1 + ' per lettura');

    t.file.checkIfFileExists(t, indice, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
      t.utility.scriveDebug(t, 'Esiste file immagine ' + nomeFileJSON1 + ': ' + Ritorno);
      if (Ritorno === 'SI') {
        // Carica immagine
        const indice = 5;
        ComponentFile.fileJSON[indice] = '';
        const path = t.file.sistemaNomeFile(ComponentFile.pathSD + '/LooigiSoft/Immagini/' + artista + '/' + album + '/' + nome);
        t.file.readFile(t, path, indice).then((Ritorno: string) => {
          t.immagineSfondo = Ritorno;
          t.immagineBrano = Ritorno;
        });
        /* const si = setInterval(() => {
          if (ComponentFile.fileJSON[indice] !== '') {
            clearInterval(si);
    
            t.immagineSfondo = ComponentFile.fileJSON[indice];
            t.immagineBrano = ComponentFile.fileJSON[indice];
          }
        }); */
      }
    });
    /* let q = 0;
    const t1 = setInterval(() => {
      if (ComponentFile.esisteFile[indice] !== '') {
        clearInterval(t1);
        if (ComponentFile.esisteFile[indice] === 'SI') {
          // Carica immagine
          const indice = 5;
          ComponentFile.fileJSON[indice] = '';
          const path = t.file.sistemaNomeFile(ComponentFile.pathSD + '/LooigiSoft/Immagini/' + artista + '/' + album + '/' + nome);
          t.file.readFile(t, path, indice);
          const si = setInterval(() => {
            if (ComponentFile.fileJSON[indice] !== '') {
              clearInterval(si);
      
              t.immagineSfondo = ComponentFile.fileJSON[indice];
              t.immagineBrano = ComponentFile.fileJSON[indice];
            }
          });
        }
      }
    }); */
  }

  scriveTestoSeNonEsiste(t, artista, album, nome, blob) {
    const indice = 7;
    ComponentFile.esisteFile[indice] = '';
    const cartellaJSON1 = 'LooigiSoft';
    const nomeFileJSON1 = 'looWebPlayer/Testi/' + artista + '/' + album + '/' + nome + '.txt';
    t.utility.scriveDebug(t, 'Esiste file testo ' + nomeFileJSON1 + ' per scrittura');

    t.file.checkIfFileExists(t, indice, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
      t.utility.scriveDebug(t, 'Esiste file testo ' + nomeFileJSON1 + ': ' + Ritorno);
      if (Ritorno !== 'SI') {
        t.file.writeFile(t, indice, 'LooigiSoft', 'looWebPlayer/Testi/' + artista + '/' +
          album + '/' + nome + '.txt', blob);
      }
    });
    /* let q = 0;
    const t1 = setInterval(() => {
      if (ComponentFile.esisteFile[indice] !== '') {
        clearInterval(t1);
        if (ComponentFile.esisteFile[indice] === 'SI') {
        } else {
          t.file.writeFile(t, indice, 'LooigiSoft', 'looWebPlayer/Testi/' + artista + '/' +
            album + '/' + nome + '.txt', blob);
        }
      }
    }); */
  }

  leggeTestoSeEsiste(t, artista, album, nome) {
    const indice = 8;
    ComponentFile.esisteFile[indice] = '';
    const cartellaJSON1 = 'LooigiSoft';
    const nomeFileJSON1 = 'looWebPlayer/Testi/' + artista + '/' + album + '/' + nome + '.txt';
    t.utility.scriveDebug(t, 'Esiste file testo ' + nomeFileJSON1 + ' per lettura');

    t.file.checkIfFileExists(t, indice, cartellaJSON1, nomeFileJSON1).then(Ritorno => {
      t.utility.scriveDebug(t, 'Esiste file testo ' + nomeFileJSON1 + ': ' + Ritorno);
      if (Ritorno === 'SI') {
        // Carica immagine
        const indice = 5;
        ComponentFile.fileJSON[indice] = '';
        const path = t.file.sistemaNomeFile(ComponentFile.pathSD + '/LooigiSoft/Testi/' + artista + '/' + album + '/' + nome + '.txt');
        t.file.readFile(t, path, indice).then((Ritorno: string) => {
          t.testo = Ritorno;
          t.testoTradotto = '';
        });
        /* const si = setInterval(() => {
          if (ComponentFile.fileJSON[indice] !== '') {
            clearInterval(si);
    
            t.testo = ComponentFile.fileJSON[indice];
            t.testoTradotto = '';
          }
        }); */
      }
    });
    /* let q = 0;
    const t1 = setInterval(() => {
      if (ComponentFile.esisteFile[indice] !== '') {
        clearInterval(t1);
        if (ComponentFile.esisteFile[indice] === 'SI') {
          // Carica immagine
          const indice = 5;
          ComponentFile.fileJSON[indice] = '';
          const path = t.file.sistemaNomeFile(ComponentFile.pathSD + '/LooigiSoft/Testi/' + artista + '/' + album + '/' + nome + '.txt');
          t.file.readFile(t, path, indice);
          const si = setInterval(() => {
            if (ComponentFile.fileJSON[indice] !== '') {
              clearInterval(si);
      
              t.testo = ComponentFile.fileJSON[indice];
              t.testoTradotto = '';
            }
          });
        }
      }
    }); */
  }

  scriveDebug(t, cosa) {
    if (t.debug === true) {      
      console.log(cosa, t.debug);

      const d = this.datePipe.transform(new Date() , 'HH:mm:ss', 'UTC');

      // if (this.deviceGirante === 'Android') {
        // if (cosa.toUpperCase().indexOf('ERROR') > -1) {
        //   this.debuggone += (d + ' -> ' + cosa + '<br />'); 
        // } else {
          t.debuggone += (d + ' -> ' + cosa + '<br />'); 
        // }
        this.metteFiltroDebug(t);
      // } else {
      //   console.log(d + ' -> ' + cosa);
      // }
      // this.operazioneInCorso = cosa;
    }
  }

  metteFiltroDebug(t) {
    if (t.filtroImpostatoDebug !== '') {
      const righe = t.debuggone.split('<br />');
      let d = '';
      righe.forEach(element => {
        if (element.toUpperCase().indexOf(t.filtroImpostatoDebug.toUpperCase().trim()) > -1) {
          d += element + '<br />';
        }
      });
      t.debuggone2 = d;
    } else {
      t.debuggone2 = t.debuggone;
    }

    if (t.filtroImpostato === '') {
      try {
        t.myScrollContainer.nativeElement.scrollTop = t.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { 

      }
    }
  }

  cercaUtenza(t) {
    /* if (UtilityComponent.haEseguitoGiaIlCostruttore) {
      return;
    } */
    return new Promise(async (Ritorno) => {    
      this.scriveDebug(t, "Crea utenza: Inizio");
  
    // setTimeout(() => {

      // alert('1');
      /* if (!this.isConnected) {
        // alert('2');
        this.caricaTutto();
        return;
      } */
  
      // alert(this.utenza);
      if (!t.utenza || t.utenza === null || t.utenza === '') {
        this.apiService.creaUtenza('')
        .map(response => t.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              this.scriveDebug(t, 'Lettura utenza: ok');
              // alert(data);
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                // console.log(JSON.parse(data2));
                if (data2.indexOf('ERROR:') === -1) {
                  if (data2.indexOf('§') === -1) {
                    // Utenza rilevata
                    const d = data2.split(';');

                    t.utenza = d[2];
                    t.idUtenza = +d[1];
                    t.Amministratore = d[3];

                    localStorage.setItem('utenza', t.utenza);
                    localStorage.setItem('idUtenza', t.idUtenza.toString());
                    localStorage.setItem('tipoUtenza', t.Amministratore);

                    Ritorno('OK');
                    // this.caricaTutto();
                  } else {
                    // Utenza da scegliere
                    const d = data2.split('§');
                    t.Utenti = new Array();
                    d.forEach(element => {
                      if (element && element !== '') {
                        const dd = element.split(';');
                        const ddd = {
                          idUtente: +dd[0],
                          Utente: dd[1],
                          Amministratore: dd[2],
                          Password: dd[3]
                        }
                        t.Utenti.push(ddd);
                      }
                    });
                    // console.log('Lista Utenti', this.Utenti);
                    t.caricamentoInCorso = false;
                    t.mostraSceltaUtenti = true;
                  }
                } else {
                  // alert('data2');
                  this.visualizzaMessaggio(this, 'Lettura utenza: ' + data2, true);

                  Ritorno('ERROR: ' + data2);
                }
              } else {
                this.visualizzaMessaggio(this, 'Lettura utenza: Nessun dato ricevuto', true);

                Ritorno('ERROR: Nessun dato ricevuto');
              }
            },
            (error) => {
              if (error instanceof Error) {
                this.visualizzaMessaggio(this, 'Lettura utenza: ' + error.message, true);

                Ritorno('ERROR: ' + error.message);
              }
            }
          );
      } else {
        this.scriveDebug(t, 'Lettura utenza. Skippo');
        // this.caricaTutto();

        Ritorno('OK');
      }
      // this.startTimerScritte();
    // }, 1000);
    });
  }

  async caricaJsonBrani(t) {
    this.scriveDebug(t, 'Carico JSON brani');
    return new Promise((Ritorno) => {
      t.caricamentoInCorso = true;
      if (t.isConnected) {
        this.apiService.ritornaJSONBrani(
          t.idUtenza
        ).map(response => this.apiService.controllaRitorno(response))
        .subscribe(
          data => {
            t.caricamentoInCorso = false;
            const d = this.apiService.prendeSoloDatiValidi(data);
            console.log(d);
            Ritorno(d);
          }
        );
      } else {
        this.scriveDebug(t, 'Connessione assente. Impossibile recuperare il JSON dei brani');
        // this.refreshCanzoniSenzaDomanda();
        // this.nonHaTrovatoJSON();
        Ritorno('ERROR: Connessione assente');
      }
      // alert('1');
      // if (t.isConnected) {
      /* this.getJSONBrani(t).subscribe(data => {
        // this.caricamentoInCorso = false;
        if (data && data !== null) {
          this.scriveDebug(t, 'Caricato JSON brani');
          try {
            // t.datiJSON = JSON.parse(data._body);          
            Ritorno(data._body);
          } catch (e) {
            this.scriveDebug(t, 'Problemi sul dati JSON: ' + e.message);
            // this.refreshCanzoniSenzaDomanda();
            // this.nonHaTrovatoJSON();
            Ritorno('ERROR: ' + e.message);
            return;
          }
                  
          // t.prosegueCaricaJsonBrani2(true);
        } else {
          this.scriveDebug(t, 'Ritorno nullo del dati JSON');
          // this.refreshCanzoniSenzaDomanda();
          // this.nonHaTrovatoJSON();
          Ritorno('ERROR: Ritorno nullo');
        }
      }); */ 
    }); 
  }

  private getJSONBrani(t): Observable<any> {
    this.scriveDebug(t, 'Prende JSON brani');
    const path = t.urlWS + 'Canzoni_' + t.idUtenza + '.json?id=' + new Date();
    return this.http.get(t, path).catch(this.catchAuthError(this));
  }

  private catchAuthError(t) {
    // console.log('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log('ERRORE Http: ', res);
      if (res.status === 404) {
        this.scriveDebug(t, 'JSON non trovato');
        // this.nonHaTrovatoJSON();
      }
      return observableThrowError(res);
    };
  }

  prosegueCaricaJsonBrani2(t, scrivo) {          
    this.scriveDebug(t, 'Proseguo elaborazione file brani');

    t.datiJSON.forEach(element => {
      const artista = element.text;
      element.children.forEach(element2 => {
        const album = element2.text;
        let anno = element2.Anno;
        if (!anno || anno === null || anno === '') { 
          anno = '0000'; 
        }
        element2.children.forEach(element3 => {
          const titolo = element3.Text;
          let traccia = element3.Traccia;
          if (!traccia || traccia === '' || traccia === null) { traccia = '00'; }
          const estensione = element3.Estensione;
          const path = 'LooigiSoft/looWebPlayer/Brani/' + artista + '/' + anno + '-' + album + '/' + traccia + '-' + titolo + estensione
          element3.path = path;
          element3.locale = false;
        });
      });
    });
    // console.log(this.datiJSON);

    if (t.deviceGirante === 'Android' && scrivo === true) {
      this.file.writeFile(this, 4, 'LooigiSoft', 'looWebPlayer/jsonBrani.json', JSON.stringify(t.datiJSON)).then((Ritorno) => {
        this.scriveDebug(t, 'Aggiornato file brani');
      });
    }

    // this.prosegueCaricaJSON();
  }

  sistemaTitoloBrano(t) {
    /* let a = t.indexOf('.');
    if (a > -1) {

    } */
    return t;
  }

  gestisceConnessione(t, isConnected) {
    t.utility.scriveDebug(t, 'Lettura Rete. Cambio stato connessione: ', isConnected, t.deviceGirante);

    if (t.deviceGirante === 'Android') {
      if (isConnected === false) {
        t.utility.scriveDebug(t, 'Connessione internet mancante. Attivo brani locali');
        t.lastCanzoniLocali = t.canzoniLocali;
        t.lastConsideraStelle = t.consideraStelle;
        t.lastMaiVotate = t.maiVotate;          
        t.lastIsConnected = isConnected;

        t.canzoniLocali = true;
        t.consideraStelle = false;
        t.maiVotate = false;
        t.utility.filtraBrani(this);
      } else {
        if (t.canzoniLocali === undefined) {
          t.utility.scriveDebug(this, 'Connessione internet attiva.');
          t.canzoniLocali =  localStorage.getItem('CanzoniLocali') === 'S' ? true : false;
          t.consideraStelle =  localStorage.getItem('ConsideraStelle') === 'S' ? true : false;
          t.maiVotate =  localStorage.getItem('maiVotate') === 'S' ? true : false;
    
          t.utility.filtraBrani(this);
        } else {
          if (t.lastIsConnected !== undefined) {
            t.lastIsConnected = undefined;
            t.utility.scriveDebug(this, 'Connessione internet attiva. Imposto ultimo canzoni locali');
            t.canzoniLocali = t.lastCanzoniLocali;
            t.consideraStelle = t.lastConsideraStelle;
            t.maiVotate = t.lastMaiVotate;    
            t.utility.filtraBrani(this);
          } else {
            t.utility.scriveDebug(this, 'Connessione internet attiva ma non c\'è il last connected');
            t.lastIsConnected = undefined;
            t.canzoniLocali = false;
            t.consideraStelle = true;
            t.maiVotate = false;
            t.utility.filtraBrani(this);
          }
        }
      }
    }

  }
}