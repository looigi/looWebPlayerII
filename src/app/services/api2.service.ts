import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from './httpclient.service';
import {throwError as observableThrowError, Observable} from 'rxjs';
import { EMPTY, empty, of } from "rxjs";
import { UtilityComponent } from '../varie/utility.component';

@Injectable()
export class ApiService {
  // private urlBase = this.variabiliGlobali.urlWS;
  // private urlRoot = environment.urlRoot;
  urlWS = '';
  urlMP3 = '';
  urlImmagine = '';
  formPrincipale;
  lastChiamata = '';
  errori = 0;
  formChiamante;
  eConnesso = true;
  utility;

  constructor(
    private httpclient: HttpService,
    // private utility: UtilityComponent
  ) {
  }

  impostaThis(t, u) {
    this.formPrincipale = t;
    this.utility = u;
  }

  impostaConnesso(ec) {
    this.eConnesso = ec;
    // console.log('API Connesse', ec);
  }

  controllaRitorno(r) {
    let rr = new Response();
    // this.apiService.controllaRitorno(response)  
    // console.log('Ritorno: ', r, typeof(r), JSON.stringify(r));
    if (JSON.stringify(r) === '{}') {
      rr['_body'] = '<?xml version="1.0" encoding="utf-8"?><string xmlns="http://wsLWP2.org/">ERROR: Nessuna connessione attiva</string></xml>';
    } else {
      if (r) {
        rr = r;
      } else {
        rr['_body'] = '<?xml version="1.0" encoding="utf-8"?><string xmlns="http://wsLWP2.org/">ERROR: Nessun ritorno</string></xml>';
      }
    }
    return rr.text();
  }

  ritornaUrlWS() {
    return this.urlWS;
  }

  ritornaUrlMP3() {
    return this.urlMP3;
  }

  impostaUrlWS(e1) {
    this.urlWS = e1;
  }

  impostaUrlMP3(e1) {
    this.urlMP3 = e1;
  }

  ritornaUrlImmagine() {
    return this.urlImmagine;
  }

  impostaUrlImmagine(e1) {
    this.urlImmagine = e1;
  }

  cambiaChar(ee, c1, c2) {
    while (ee.indexOf(c1) > -1) {
        ee = ee.replace(c1, c2);
    }
    return ee;
  }

  sistemaTesto(e): string {
    if (e === undefined || e === 'undefined' || e === '' || e === null) {
        return '';
    }

    let ee = e.toString();

    ee = this.cambiaChar(ee, '.', '%2E');
    ee = this.cambiaChar(ee, '<', '%3C');
    ee = this.cambiaChar(ee, '>', '%3E');
    ee = this.cambiaChar(ee, '#', '%23');
    ee = this.cambiaChar(ee, '{', '%7B');
    ee = this.cambiaChar(ee, '}', '%7D');
    ee = this.cambiaChar(ee, '|', '%7C');
    ee = this.cambiaChar(ee, '\\', '%5C');
    ee = this.cambiaChar(ee, '^', '%5E');
    ee = this.cambiaChar(ee, '~', '%7E');
    ee = this.cambiaChar(ee, '[', '%5B');
    ee = this.cambiaChar(ee, ']', '%5D');
    ee = this.cambiaChar(ee, '`', '%60');
    // ee = this.cambiaChar(ee, ';', '%3B');
    ee = this.cambiaChar(ee, '/', '%2F');
    ee = this.cambiaChar(ee, '?', '%3F');
    ee = this.cambiaChar(ee, ':', '%3A');
    ee = this.cambiaChar(ee, '@', '%40');
    ee = this.cambiaChar(ee, '=', '%3D');
    ee = this.cambiaChar(ee, '&', '%26');
    ee = this.cambiaChar(ee, '$', '%24');

    return ee;
  }

  prendeSoloDatiValidi(s) {
    // console.log(JSON.stringify(s));
    if (JSON.stringify(s) === '{}') {
      return 'ERROR: Nessuna connessione attiva';
    }

    let ss = s;

    let a1 = ss.indexOf('<string');
    if (a1 > -1) {
      ss = ss.substring(a1, ss.length);
      a1 = ss.indexOf('>');
      if (a1 > -1) {
        ss = ss.substring(a1 + 1, ss.length);
        a1 = ss.indexOf('</string>');
        if (a1 > -1) {
          ss = ss.substring(0, a1);
        }
      }
    }

    ss = this.cambiaChar(ss, '&amp;', '&');
    ss = this.cambiaChar(ss, '&lt;', '<');
    ss = this.cambiaChar(ss, '&gt;', '>');
    ss = this.cambiaChar(ss, '&num;', '#');
    ss = this.cambiaChar(ss, '&lcub; &lbrace;', '{');
    ss = this.cambiaChar(ss, '&lcub;', '{');
    ss = this.cambiaChar(ss, '&lbrace;', '{');
    ss = this.cambiaChar(ss, '&lcub;&lbrace;', '{');
    ss = this.cambiaChar(ss, '&rcub; &rbrace;', '}');
    ss = this.cambiaChar(ss, '&rcub;', '}');
    ss = this.cambiaChar(ss, '&rbrace;', '}');
    ss = this.cambiaChar(ss, '&rcub;&rbrace;', '}');
    ss = this.cambiaChar(ss, '&verbar;', '|');
    ss = this.cambiaChar(ss, '&vert;', '|');
    ss = this.cambiaChar(ss, '&VerticalLine;', '|');
    ss = this.cambiaChar(ss, '&bsol;', '\\');
    ss = this.cambiaChar(ss, '&circ;', '^');
    ss = this.cambiaChar(ss, '&tilde;', '~');
    ss = this.cambiaChar(ss, '&lsqb;', '[');
    ss = this.cambiaChar(ss, '&lbrack;', '[');
    ss = this.cambiaChar(ss, '&rsqb;', ']');
    ss = this.cambiaChar(ss, '&rbrack;', ']');
    ss = this.cambiaChar(ss, '&grave;', '`');
    ss = this.cambiaChar(ss, '&semi;', ';');
    ss = this.cambiaChar(ss, '&sol;', '/');
    ss = this.cambiaChar(ss, '&quest;', '?');
    ss = this.cambiaChar(ss, '&colon;', ':');
    ss = this.cambiaChar(ss, '&commat;', '@');
    ss = this.cambiaChar(ss, '&equals;', '=');
    ss = this.cambiaChar(ss, '&dollar;', '$');

    return ss;
  }

  resettaErrori() {
    this.errori = 0;
  }
  
  private catchAuthError() {
    // console.log('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      if (res.status === 0) {
        this.errori++;
        if (this.errori <= 5) {
          setTimeout(() => {
            this.utility.scriveDebug(this.formPrincipale, 'ERRORE HTTP: 0 MALEDETTO. Riprovo a ricaricare con la funzione ' + this.lastChiamata);
            switch (this.lastChiamata) {
              case '2':
                this.utility.scriveDebug(this.formPrincipale, 'ERRORE HTTP: 0 MALEDETTO. Eseguo funzione 2');
                this.formChiamante.caricaBrano(this.formPrincipale);
                this.utility.scriveDebug(this.formPrincipale, 'ERRORE HTTP: 0 MALEDETTO. Eseguita funzione 2');
                break;
            }
          }, 1000);
        } else {
          this.utility.scriveDebug(this.formPrincipale, 'ERRORE HTTP: 0 MALEDETTO. Tentativi esauriti');
          this.formPrincipale.caricatoProssimoBrano = false;
        }
      } else {
        this.utility.scriveDebug(this.formPrincipale, 'ERRORE HTTP: ' + JSON.stringify(res));
      }
      // console.log('ERRORE Http: ', res);
      return observableThrowError(res);
    }
  }

  ritornaProssimoBrano(idUtente, params, formChiamante) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaProssimoBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaProssimoBrano?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'Random=' + this.sistemaTesto(params.Random) + '&' +
      'vecchioBrano=' + this.sistemaTesto(params.NumeroBrano);
    this.formChiamante = formChiamante;
    this.lastChiamata = '1';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaProssimoBrano. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ritornaBrano(idUtente, params, formChiamante) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaBranoDaID?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'Brano=' + this.sistemaTesto(params.NumeroBrano) +
      '&ForzaAggiornamentoTesto=N';
    this.formChiamante = formChiamante;
    this.lastChiamata = '2';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaBrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  scaricaVideoPregressi() {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaVideoPregressi. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaVideoPregressi';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaVideoPregressi. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ScaricaVideoYouTube(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaVideoYouTube. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaVideoYouTube?' +
      'prefisso=' + this.sistemaTesto(params.prefisso) + '&' +
      'link=' + this.sistemaTesto(params.link) + '&' +
      'estensione=' + this.sistemaTesto(params.estensione)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScricaVideoYouTube. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ritornaYouTube(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaYouTube. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaYouTube?' +
      'nomeArtista=' + this.sistemaTesto(params.nomeArtista) + '&' +
      'nomeBrano=' + this.sistemaTesto(params.nomeBrano) + '&' +
      'refresh=' + this.sistemaTesto(params.refresh)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaYouTube. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  SalvaVideoDefault(idBrano, idVideo) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. SalvaVideoDefault. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/SalvaVideoDefault?' +
      'idBrano=' + this.sistemaTesto(idBrano) + '&' +
      'idVideo=' + this.sistemaTesto(idVideo)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. SalvaVideoDefault. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  scriveVideoDaSalvare(video) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveVideoDaSalvare. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScriveVideoDaSalvare?' +
      'Video=' + this.sistemaTesto(video)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveVideoDaSalvare. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  salvaVideo(prefisso, link, estensione) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. SalvaVideo. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaVideoYouTube?' +
      'prefisso=' + this.sistemaTesto(prefisso) + '&' +
      'link=' + this.sistemaTesto(link) + '&' +
      'estensione=' + this.sistemaTesto(estensione)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. SalvaVideo. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  EliminaBrutte(idUtente) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaBrutte. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaBrutte?idUtente=' + idUtente
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaBrutte. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  RitornaUguali() {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaUguali. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaUguali'
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaUguali. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ScaricaNuovaImmagine(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. Scarica nuova immagine. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaNuovaImmagine?' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' +
      'Album=' + this.sistemaTesto(params.Album) + '&' +
      'Canzone=' + this.sistemaTesto(params.Canzone)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaNuovaImmagine. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  RitornaImmaginiArtista(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaImmaginiArtista. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaImmaginiArtista?' +
      'Artista=' + this.sistemaTesto(params)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaImmaginiArtista. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ScaricaTesto(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaTesto. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaTesto?' +
      'idCanzone=' + this.sistemaTesto(params.idCanzone) + '&' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' +
      'Album=' + this.sistemaTesto(params.Album) + '&' +
      'Canzone=' + this.sistemaTesto(params.Canzone)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaTesto. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ScriveTesto(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveTesto. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScriveTestoBrano?' +
      'idCanzone=' + this.sistemaTesto(params.idCanzone) + '&' +
      'Testo=' + this.sistemaTesto(params.Testo)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveTesto. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ritornaJSONBrani(idUtente) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaJSONBrani. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaJSON?idUtente=' + idUtente;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaJSONBrani. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError())
    // console.log(ritorno);
    return ritorno;
  }

  creaUtenza(utenza) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. CreaUtenza. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/CreaRitornaUtenza?Utenza=' + utenza;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. CreaUtenza. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  refreshDB(idUtente) {
    const url = this.urlWS + 'wsLWP.asmx/RefreshCanzoni?idUtente=' + idUtente;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RefreshDB. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  refreshDBHard(idUtente) {
    const url = this.urlWS + 'wsLWP.asmx/RefreshCanzoniHard?idUtente=' + idUtente;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RefreshDBHard. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  scriveVolteAscoltata(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveVolteAscoltata. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/SettaAscoltataDaID?' +
      'idUtente=' + idUtente + '&' +
      'NumeroBrano=' + params
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScriveVolteAscoltata. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  ritornaVolteAscoltata(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaVolteAscoltata. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaAscoltataDaID?' +
      'idUtente=' + idUtente + '&' +
      'NumeroBrano=' + params
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaVolteAscoltata. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  impostaStelle(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ImpostaStelle. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/SettaStelle?' +
      'idUtente=' + idUtente + '&' +
      'idCanzone=' + params.idCanzone + '&' +
      'Stelle=' + params.Stelle + '&'
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ImpostaStelle. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  downloadPagina(url) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. DownloadPagina. Mancanza di connessione');
      return of({});
    }
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. DownloadPagina. URL: ' + url);
    return this.httpclient.downloadFile(url);
  }

  eliminaImm(imm) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaImm. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaImmagine?' +
      'Immagine=' + this.sistemaTesto(imm);
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaImm. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  eliminaVideo(vid) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaVideo. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaVideoFisico?' +
      'Video=' + this.sistemaTesto(vid);
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaVideo. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  esisteImm(imm) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EsisteImm. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EsisteImmagine?' +
      'Immagine=' + this.sistemaTesto(imm);
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EsisteImm. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  controllaSeGiaScaricata(imm) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ControllaSeGiaScaricata. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EsisteImmagineSalvata?' +
      'Immagine=' + this.sistemaTesto(imm);
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ControllaSeGiaScaricata. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  RinominaBrano(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RinominaBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RinominaBrano?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' + 
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Album=' + this.sistemaTesto(params.Album) + '&' + 
      'Brano=' + this.sistemaTesto(params.Brano) + '&' + 
      'NuovaTraccia=' + this.sistemaTesto(params.NuovaTraccia) + '&' +
      'NuovoNomeBrano=' + this.sistemaTesto(params.NuovoNomeBrano) 
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RinominaBrano. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }
  
  RitornaUgualiDettaglio(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaUgualiDettaglio. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaUgualiDettaglio?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' + 
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Brano=' + this.sistemaTesto(params.Brano) 
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaUgualiDettaglio. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  RinominaAlbum(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RinominaAlbum. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RinominaAlbum?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' + 
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Album=' + this.sistemaTesto(params.Album) + '&' + 
      'NuovoAnno=' + this.sistemaTesto(params.NuovoAnno) + '&' +
      'NuovoNomeAlbum=' + this.sistemaTesto(params.NuovoNomeAlbum) 
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RinominaAlbum. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }
  
  EliminaBrano(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaBrano?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' + 
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Album=' + this.sistemaTesto(params.Album) + '&' + 
      'Brano=' + this.sistemaTesto(params.Brano) 
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaBrano. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }
  
  ScaricaImmagineAlbum(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaImmagineAlbum. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ScaricaImmagineAlbum?' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Album=' + this.sistemaTesto(params.Album) + '&' + 
      'Anno=' + this.sistemaTesto(params.Anno) 
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ScaricaImmagineAlbum. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }
  
  ImpostaImmagineAlbum(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ImpostaImmagineAlbum. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/ImpostaImmagineAlbum?' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' + 
      'Album=' + this.sistemaTesto(params.Album) + '&' + 
      'Anno=' + this.sistemaTesto(params.Anno) + '&' + 
      'NomeImmagine=' + this.sistemaTesto(params.NomeImmagine)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ImpostaImmagineAlbum. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  tornaDettagliArtista(artista, forza) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. TornaDettaglioArtista. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/DettagliArtista?' +
      'Artista=' + this.sistemaTesto(artista) + '&' +
      'Forza=' + forza
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. TornaDettaglioArtista. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  InviaMail(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. InviaMail. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/InviaMail?' +
      'Destinatario=' + this.sistemaTesto(params.Destinatario) + '&' +
      'Oggetto=' + this.sistemaTesto(params.Oggetto) + '&' +
      'Corpo=' + this.sistemaTesto(params.Corpo)
      ;
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. InviaMail. URL: ' + url);
    const ritorno = this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
    // console.log(ritorno);
    return ritorno;
  }

  // TAGS
  ritornaTuttiITags() {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaTuttiITags. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaTuttiITags'
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ritornaTuttiITags. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  ritornaTagsBrano(params, formChiamante) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaTagsBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaTagDaBrano?' +
      'idBrano=' + this.sistemaTesto(params.NumeroBrano)
      ;
    this.formChiamante = formChiamante;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. ritornaTagsBrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  AggiungeTagABrano(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. AggiungeTagABrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/AggiungeTagABrano?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'idBrano=' + this.sistemaTesto(params.NumeroBrano) + '&' +
      'idTag=' + this.sistemaTesto(params.idTag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. AggiungeTagABrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  EliminaTagDaBrano(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagDaBrano. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaTagDaBrano?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'idBrano=' + this.sistemaTesto(params.NumeroBrano) + '&' +
      'idTag=' + this.sistemaTesto(params.idTag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagDaBrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  SalvaTag(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. SalvaTag. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/SalvaTag?' +
      'Tag=' + this.sistemaTesto(params.Tag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagDaBrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  EliminaTag(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTag. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaTag?' +
      'idTag=' + this.sistemaTesto(params.idTag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagDaBrano. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  RitornaTuttiTagArtista(params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaTuttiITagArtista. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/RitornaTuttiTagArtista?' +
      'Artista=' + this.sistemaTesto(params.Artista)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. RitornaTuttiTagArtista. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  AggiungeTagAdArtista(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. AggiungeTagAdArtista. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/AggiungeTagAdArtista?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' +
      'idTag=' + this.sistemaTesto(params.idTag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. AggiungeTagAdArtista. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  EliminaTagAdArtista(idUtente, params) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagAdArtista. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaTagAdArtista?' +
      'idUtente=' + this.sistemaTesto(idUtente) + '&' +
      'Artista=' + this.sistemaTesto(params.Artista) + '&' +
      'idTag=' + this.sistemaTesto(params.idTag)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaTagAdArtista. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  checkRete(t, idUtente) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. CheckRete. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/CheckRete?' +
      'idUtente=' + this.sistemaTesto(idUtente)
      ;
    this.lastChiamata = '99';
    // this.utility.scriveDebug(this.formPrincipale, 'Apiservice. checkRete. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

  eliminaJSON(t, idUtente) {
    if (this.eConnesso === false) {
      this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaJSON. Mancanza di connessione');
      return of({});
    }
    const url = this.urlWS + 'wsLWP.asmx/EliminaJSON?' +
      'idUtente=' + this.sistemaTesto(idUtente)
      ;
    this.lastChiamata = '99';
    this.utility.scriveDebug(this.formPrincipale, 'Apiservice. EliminaJSON. URL: ' + url);
    return this.httpclient.get(this.formPrincipale, url).catch(this.catchAuthError());
  }

}
