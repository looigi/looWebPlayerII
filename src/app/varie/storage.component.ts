import { Injectable } from "@angular/core";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class StorageComponent {
  constructor(
    private utility: UtilityComponent
  ) {

  }

  leggeSettaggi(t) {
      const m0 = localStorage.getItem('CheckRicaricaBraniLocali');
      if (m0 === null) {
        t.checkRicaricaBraniLocali = false;
      } else {
        t.checkRicaricaBraniLocali = m0 === 'S' ? true : false;
      }
      const m1 = localStorage.getItem('MascheraFiltroBrani');
      if (m1 === null) {
        t.mascheraFiltroBrani = false;
      } else {
        t.mascheraFiltroBrani = m1 === 'S' ? true : false;
      }
      const m2 = localStorage.getItem('MascheraBrani');
      if (m2 === null) {
        t.mascheraBrani = false;
      } else {
        t.mascheraBrani = m2 === 'S' ? true : false;
      }
      const m3 = localStorage.getItem('MascheraOpzioni');
      if (m3 === null) {
        t.mascheraOpzioni = false;
      } else {
        t.mascheraOpzioni = m3 === 'S' ? true : false;
      }
      const m4 = localStorage.getItem('MascheraArtisti');
      if (m4 === null) {
        t.mascheraArtisti = false;
      } else {
        t.mascheraArtisti = m4 === 'S' ? true : false;
      }
      const m5 = localStorage.getItem('MascheraTesto');
      if (m5 === null) {
        t.mascheraTesto = false;
      } else {
        t.mascheraTesto = m5 === 'S' ? true : false;
      }
      const m6 = localStorage.getItem('ComandiVocaliAttivi');
      if (m6 === null) {
        t.comandiVocaliAttivi = false;
      } else {
        t.comandiVocaliAttivi = m6 === 'S' ? true : false;
      }
  
      t.modalitaYouTube = localStorage.getItem('modalitaYouTube');
      if (t.modalitaYouTube === null) {
        t.modalitaYouTube = 'N';
      }
      // console.log(t.modalitaYouTube);
      const d2 = localStorage.getItem('limita_brani');
      if (d2 === null || d2 === 'S') {
        t.limitaBrani = true;
      }
      const d3 = localStorage.getItem('limite_brani');
      if (d3 !== null) {
        t.numeroLimiteBrani = +d3;
      }
      // console.log(t.debug);
  
      t.random = localStorage.getItem('random');
      if (t.random === null) {
        t.random = 'S';
      }
      /* t.visuaTesto = localStorage.getItem('visuaTesto');
      if (t.visuaTesto === null) {
        t.visuaTesto = 'S';
      } */
      const n = localStorage.getItem('NumeroStelle');
      if (n === null) {
        t.numeroStelle = 5;
      } else {
        t.numeroStelle = +n;
      }
      const mv = localStorage.getItem('maiVotate');
      if (mv === null) {
        t.maiVotate = false;
      } else {
        t.maiVotate = mv === 'S' ? true : false;
      }
      const tlc = localStorage.getItem('tutteLeCanzoni');
      /* if (tlc === null) {
        t.tutteLeCanzoni = true;
      } else {
        if (tlc === 'S') {
          t.tutteLeCanzoni = true;
        } else {
          t.tutteLeCanzoni = false;
        }
      } */
      t.sfuma = localStorage.getItem('sfuma') === 'S' ? true : false;
      t.cicla = localStorage.getItem('cicla') === 'S' ? true : false;
      /* t.ultimoFiltro = localStorage.getItem('Dati_' + tlc);
      if (t.ultimoFiltro !== null) {
        t.ultimoFiltroArray = t.ultimoFiltro.split(',');
      } else {
        t.ultimoFiltroArray = new Array();
      }
      console.log('Impostato ultimo filtro 0', t.ultimoFiltroArray); */
      t.linguaggio = localStorage.getItem('linguaggio');
      if (t.linguaggio === null) {
        t.linguaggio = 'OR';
      }
      if (t.linguaggio === 'OR') {
        t.linguaggioIcona = 'assets/immagini/inglese.png';
      } else {
        t.linguaggioIcona = 'assets/immagini/italiano.png';
      }
      const d = localStorage.getItem('debug');
      if (d === null || d === 'S') {
        t.debug = true;
      }    
      const tt = localStorage.getItem('tagsRicerca');
      if (tt === null) {
        t.tagsRicerca = {};
      } else {
        t.tagsRicerca = JSON.parse(tt);
      }
      const f = localStorage.getItem('FiltroTesto');
      if (f === null) {
        t.filtroImpostato = '';
      } else {
        t.filtroImpostato = f;
      }
      t.visuaTagBrano = localStorage.getItem('visuaTagBrano') === 'S' ? true : false;
      const ee = localStorage.getItem('esclusioni');
      if (ee === null) {
        t.esclusioni = '';
      } else {
        t.esclusioni = ee;
      }
  }

  cambiaFiltro2(t, e) {
      // if (e.length > 2) {
        // console.log(e);
        t.filtroImpostato = e;
        localStorage.setItem('FiltroTesto', t.filtroImpostato);
        // this.checkTutteLeCanzoni(t);
      /* } else {
        if (e === '') {
          t.filtroImpostato = '';
          this.checkTutteLeCanzoni(t);
        }
      } */
  }

    cambiaEsclusioni(t, e) {
      // if (e.length > 2) {
        // console.log(e);
        t.esclusioni = e;
        localStorage.setItem('esclusioni', t.esclusioni);
        // this.checkTutteLeCanzoni(t);
      /* } else {
        if (e === '') {
          t.filtroImpostato = '';
          this.checkTutteLeCanzoni(t);
        }
      } */
  }

  checkVisuaTagBrano(t, e) {
    if (e === false) {
      t.visuaTagBrano = false;
    } else {
      t.visuaTagBrano = e.srcElement.checked;
    }
    localStorage.setItem('visuaTagBrano', t.visuaTagBrano === true ? 'S' : 'N');
  }

  checkCanzoniMamma(t, e) {
      t.canzoniMamma = e.srcElement.checked;
      if (t.canzoniMamma === true) {
        t.consideraStelle = false;
      }
      localStorage.setItem('CanzoniMamma', t.canzoniMamma === true ? 'S' : 'N');
      this.checkTutteLeCanzoni(t);
  }
    
  checkEliminaMamma(t, e) {
      t.eliminaMamma = e.srcElement.checked;
      localStorage.setItem('TutteCanzoni', t.eliminaMamma === true ? 'S' : 'N');
      this.checkTutteLeCanzoni(t);
  }
    
  checkSoloCanzoniLocali(t, e) {
      if (t.isConnected === true) {
        t.canzoniLocali = e.srcElement.checked;
        if (t.consideraStelle === true) {
          t.vecchioConsideraStelle = t.consideraStelle;
          t.consideraStelle = false;
        } else {
          if (t.vecchioConsideraStelle === undefined) {
            const v = localStorage.getItem('ConsideraStelle');
            t.vecchioConsideraStelle = v === 'S' ? true : false;
          }
          t.consideraStelle = t.vecchioConsideraStelle;
        }
        localStorage.setItem('CanzoniLocali', t.canzoniLocali === true ? 'S' : 'N');
        this.checkTutteLeCanzoni(t);
      } else {
        t.canzoniLocali = true;
      }
  }
    
  checkConsideraStelle(t, e) {
      if (t.isConnected === true) {
        t.consideraStelle = e.srcElement.checked;
        localStorage.setItem('ConsideraStelle', t.consideraStelle === true ? 'S' : 'N');
        this.checkTutteLeCanzoni(t);
      } else {
        t.canzoniLocali = true;
      }
  }
  
  cambiaStelle(t, e) {
      if (e < 0 || e > 10) {
        alert('Valore non valido');
        t.numeroStelle = 5;
        return;
      }
      t.numeroStelle = e;
      localStorage.setItem('NumeroStelle', t.numeroStelle.toString());
      this.checkTutteLeCanzoni(t);
  }
  
  checkMaiVotate(t, e) {
      t.maiVotate = e.srcElement.checked;
      localStorage.setItem('maiVotate', t.maiVotate === true ? 'S' : 'N');
      this.checkTutteLeCanzoni(t);
  }
  
  checkTutteLeCanzoni(t) {
      setTimeout(() => {
        // const filtro = chi;
        // t.tutteLeCanzoni = e.srcElement.checked;
        // t.filtraBrani();
        /* t.ultimoFiltro = localStorage.getItem('Dati_' + t.tutteLeCanzoni);
        if (t.ultimoFiltro !== null) {
          t.ultimoFiltroArray = t.ultimoFiltro.split(',');
        } else {
          t.ultimoFiltroArray = new Array();
        } */
        t.utility.filtraBrani(t);
      }, 10);
  }    

  checkComandiVocali(t, e) {
    if (e.srcElement) {
      t.comandiVocaliAttivi = e.srcElement.checked;
    } else {
      t.comandiVocaliAttivi = e;
    }

    localStorage.setItem('ComandiVocaliAttivi', t.comandiVocaliAttivi === true ? 'S' : 'N');

    if (t.comandiVocaliAttivi === true) {
      t.speechService.init(this);
      t.speechService.start();  
    } else {
      t.speechService.stop();  
    }
    this.gestisceFinestre();
  }

  checkFiltroBrani(t, e) {
    if (e.srcElement) {
      t.mascheraFiltroBrani = e.srcElement.checked;
    } else {
      t.mascheraFiltroBrani = e;
    }
    localStorage.setItem('MascheraFiltroBrani', t.mascheraFiltroBrani === true ? 'S' : 'N');
    this.utility.scriveDebug(t, 'Filtro brani: ' + t.mascheraFiltroBrani);
    this.gestisceFinestre();
  }
    
  checkBrani(t, e) {
      if (!e.srcElement) {
          t.mascheraBrani = e;
      } else {
          t.mascheraBrani = e.srcElement.checked;
      }
      localStorage.setItem('MascheraBrani', t.mascheraBrani === true ? 'S' : 'N');
      this.gestisceFinestre();
  }
    
  checkTesto(t, e) {
      if (!e.srcElement) {
          t.mascheraTesto = e;
      } else {
          t.mascheraTesto = e.srcElement.checked;
      }
      localStorage.setItem('MascheraTesto', t.mascheraTesto === true ? 'S' : 'N');
      this.gestisceFinestre();
  }
    
  checkOpzioni(t, e) {
      if (!e.srcElement) {
          t.mascheraOpzioni = e;
      } else {
          t.mascheraOpzioni = e.srcElement.checked;
      }
      localStorage.setItem('MascheraOpzioni', t.mascheraOpzioni === true ? 'S' : 'N');
      this.gestisceFinestre();
  }
    
  checkArtisti(t, e) {
      if (!e.srcElement) {
          t.mascheraArtisti = e;
      } else {
          t.mascheraArtisti = e.srcElement.checked;
      }
      localStorage.setItem('MascheraArtisti', t.mascheraArtisti === true ? 'S' : 'N');
      this.gestisceFinestre();
  }
  
  checkAbout(t, e) {
      if (!e.srcElement) {
          t.mascheraAbout = e;
      } else {
          t.mascheraAbout = e.srcElement.checked;
      }
  }

  checkDebug(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        t.debug = e.srcElement.checked;
        localStorage.setItem('debug', t.debug === true ? 'S' : 'N');
        // console.log(sfuma, this.sfuma);
      }, 100);
  }
  
  checkRicarica(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        t.checkRicaricaBraniLocali = e.srcElement.checked;
        localStorage.setItem('CheckRicaricaBraniLocali', t.checkRicaricaBraniLocali === true ? 'S' : 'N');
        // console.log(sfuma, this.sfuma);
      }, 100);
  }
  
  checkLimitaBrani(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        t.limitaBrani = e.srcElement.checked;
        localStorage.setItem('limita_brani', t.limitaBrani === true ? 'S' : 'N');
        // console.log(sfuma, this.sfuma);
      }, 100);
  }

  cambiaLimiteBrani(t, e) {
      if (e.length > 0) {
        // console.log(e);
        t.numeroLimiteBrani = +e;
        localStorage.setItem('limite_brani', t.numeroLimiteBrani.toString());
      } else {
        alert('Valore non valido');
      }
  }

  checkRandom(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        if (e.srcElement.checked === true) {
          t.random = 'S';
        } else {
          t.random = 'N';
        }
        localStorage.setItem('random', t.random);
      }, 100);
  }
    
      /* checkVisuaTesto(e) {
        setTimeout(() => {
          // console.log(e.srcElement.checked);
          if (e.srcElement.checked === true) {
            this.visuaTesto = 'S';
          } else {
            this.visuaTesto = 'N';
          }
          localStorage.setItem('visuaTesto', this.visuaTesto);
        }, 100);
      } */
    
  checkSfumaImmagini(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        let sfuma;
        if (e.srcElement.checked === true) {
          sfuma = 'S';
        } else {
          sfuma = 'N';
        }
        t.sfuma = e.srcElement.checked;
        localStorage.setItem('sfuma', sfuma);
        // console.log(sfuma, this.sfuma);
      }, 100);
  }
  
  checkCiclaImmagini(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        let cicla;
        if (e.srcElement.checked === true) {
          cicla = 'S';
          t.startTimerImmagine();
        } else {
          if (t.intervalImmagine) {
            clearInterval(t.intervalImmagine);
          }
          cicla = 'N';
        }
        t.cicla = e.srcElement.checked;
        localStorage.setItem('cicla', cicla);
        // console.log(sfuma, this.sfuma);
      }, 100);
  }

  checkModalitaYouTube(t, e) {
      setTimeout(() => {
        // console.log(e.srcElement.checked);
        if (e.srcElement.checked === true) {
          t.modalitaYouTube = 'S';
          if (t.videoNONCaricato === true) {
            if (t.videoplayer && t.modalitaYouTube === 'S') {
              setTimeout(() => {
                t.videoplayer.playVideo();
              }, 100);
            }
          } else {
            if (t.videoplayerLocale && t.modalitaYouTube === 'S') {
              // this.videoplayerLocale.nativeElement.mute();
              setTimeout(() => {
                t.videoplayerLocale.nativeElement.play()
              }, 100);
            }
          }
        } else {
          t.modalitaYouTube= 'N';
          if (t.videoNONCaricato === true) {
            if (t.videoplayer && t.modalitaYouTube === 'S') {
              setTimeout(() => {
                t.videoplayer.stopVideo();
              }, 100);
            }
          } else {
            if (t.videoplayerLocale && t.modalitaYouTube === 'S') {
              // this.videoplayerLocale.nativeElement.mute();
              setTimeout(() => {
                t.videoplayerLocale.nativeElement.stop();
              }, 100);
            }
          }
        }
        localStorage.setItem('modalitaYouTube', t.modalitaYouTube);
      }, 100);
  }

  pulisceCookies() {
      if (confirm('Si vogliono eliminare tutti i cookies')) {
        // localStorage.removeItem('utenza');
        // localStorage.removeItem('idUtenza');
        // localStorage.removeItem('bellezzeJSON');
        localStorage.removeItem('Dati_S');
        localStorage.removeItem('Dati_F');
        localStorage.removeItem('Dati_M');
        localStorage.removeItem('tutteLeCanzoni');
        localStorage.removeItem('CanzoniMamma');
        localStorage.removeItem('TutteCanzoni');
        localStorage.removeItem('numero_brano');
        localStorage.removeItem('idUtenza');
        localStorage.removeItem('filtro');
        localStorage.removeItem('utenza');
        localStorage.removeItem('tipoUtente');
        localStorage.removeItem('sfuma');
        localStorage.removeItem('cicla');
        localStorage.removeItem('random');
        localStorage.removeItem('visuaTesto');
        localStorage.removeItem('modalitaYouTube');
        localStorage.removeItem('linguaggio');
        localStorage.removeItem('tagsRicerca');
  
        window.location.reload();
      }
  }
                  
  gestisceFinestre() {

  }
      
  checkTagsRicerca(t, e) {
    t.tagsRicerca = e;
    localStorage.setItem('tagsRicerca', JSON.stringify(e));
    this.checkTutteLeCanzoni(t);
}

}