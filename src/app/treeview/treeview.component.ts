import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { fade } from "../animations";
import { ApiService } from "../services/api2.service";
import { UtilityComponent } from "../varie/utility.component";

@Component({
    selector: 'app-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.css'],
    animations: fade,
    encapsulation: ViewEncapsulation.None,
})

export class TreeViewComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild("divScroll", { static: false }) divScroll: ElementRef;

    @Input() braniFiltrati;
    @Input() numeroBranoSelezionato;
    @Input() playlistVisibile;
    @Input() mostraCanzoni = false;
    @Input() listaTags;
    @Input() idUtenza;
    @Input() Amministratore;
    @Input() deviceGirante;

    @Output() branoClickato: EventEmitter<Number> = new EventEmitter();
    @Output() numeroBrani: EventEmitter<Number> = new EventEmitter();
    @Output() ritornoBrani: EventEmitter<any> = new EventEmitter();
    @Output() branoInLocale: EventEmitter<boolean> = new EventEmitter();
    @Output() braniCambiati: EventEmitter<any> = new EventEmitter();

    visibile = undefined;
    numeroBrano = -1;
    brani;
    ultimoArtista = -1;
    ultimoAlbum = -1;
    quantiBrani = -1;
    mostraBrani = false;
    suSSD = false;
    tagsBrano;
    tagsArtista;
    fMostraTag = false;
    fMostraTagArtista = false;
    mostraAggiungeTag = false;
    listaTagsVisualizzati;
    artistaSelezionato = '';
    nuovoTag = '';
    caricamentoInCorso = false;
    posX = -1;
    posY = -100;
    testoPopup;

    constructor(
        private utility: UtilityComponent,
        private apiService: ApiService,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnChanges(e) {
        if (e.braniFiltrati) {
            this.brani = e.braniFiltrati.currentValue;
            // console.log(this.brani);
            this.quantiBrani = this.contaBrani();
            this.apreTree();
        }

        if (e.numeroBranoSelezionato) {
          if (e.numeroBranoSelezionato.currentValue) {
            this.numeroBrano = e.numeroBranoSelezionato.currentValue;
            this.apreTree();
          }
        }

        if (e.mostraCanzoni) {
            this.mostraBrani = e.mostraCanzoni.currentValue;
        }
    }

    caricaBrano() {
        // alert(this.suSSD + ':' + this.numeroBrano);
        this.branoInLocale.emit(this.suSSD);
        setTimeout(() => {
            this.branoClickato.emit(this.numeroBrano);
        }, 100);
    }
    
    contaBrani() {
        let q = 0;

        if (this.brani) {
            let art = 0;
            let alb = 0;
            this.brani.forEach(element => {
                art++;
                element.children.forEach(element2 => {
                    alb++;
                    element2.children.forEach(element3 => {
                        q++;
                    });
                });
            });
            this.visibile = this.utility.creaMatrice(art, alb, false);
            // console.log(t.visibile[0][1]);
        }
        this.numeroBrani.emit(q);

        return q;
    }

    apreTree() {
        if (this.brani && this.visibile) {
            if (this.visibile && this.ultimoArtista > -1 && this.visibile[this.ultimoArtista]) {
                this.visibile[this.ultimoArtista][0] = false;
                this.visibile[this.ultimoArtista][this.ultimoAlbum] = false;
                this.ultimoArtista = -1;
            }
            // this.visibile = new Array();
            let art = 0;
            let alb = 0;
            let f = false;
            this.brani.forEach(element => {
                if (!f) {
                    art++;
                    alb = 0;
                    element.children.forEach(element2 => {
                        if (!f) {
                            alb++;
                            element2.children.forEach(element3 => {
                                if (!f) {
                                    if (element3.id === this.numeroBranoSelezionato) {
                                        this.visibile[art - 1][0] = true;
                                        this.visibile[art - 1][alb] = true;
                                        f = true;

                                        this.ultimoArtista = art - 1;
                                        this.ultimoAlbum = alb - 1;

                                        // console.log('Aperto artista ' + art + ', album ' + (alb + 1) + '. TOP: ' + ((art -1) * 25));

                                        const ele = this.utility.effettuaReplace(element.text, '\'', '_');
                                        this.spostaDiv(this.utility.effettuaReplace(ele, ' ', '_'));
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    spostaDiv(pos) {
        if (this.playlistVisibile) {
          setTimeout(() => {
            let section = 'section_' + pos;
            // console.log('Sposto a sezione', section);
            if (this.divScroll) {
              this.divScroll.nativeElement.scroll(0, 0);
              const elem = document.querySelector('#' + section);
              // console.log('Sezione', elem);
              if (elem && elem !== null) {
                let offsetTop = elem.getBoundingClientRect().top - 160;
                // console.log('Scroll to', section, offsetTop);
                this.divScroll.nativeElement.scroll(0, offsetTop);
              }
            }
          }, 100);
        }
    }

  prendeNomeSistemato(n) {
    const nn = this.utility.effettuaReplace(n, '\'', '_');
    return 'section_' + this.utility.effettuaReplace(nn, ' ', '_');
  }

  clickatoAlbum(art, alb) {
    // console.log(art, alb);
    const artista = this.brani[art].text;
    const album = this.brani[art].children[alb].text;
    const brani = this.brani[art].children[alb].children;
    const ritorno = {
        idArtista: art,
        artista: artista,
        idAlbum: alb,
        album: album,
        anno: this.brani[art].children[alb].Anno,
        brani: brani
    };
    this.ritornoBrani.emit(ritorno);
  }

  mostraTag(brano) {
    this.tagsBrano = new Array();
    // console.log(brano.tags);
    const t = brano.tags.split('§');
    t.forEach(element => {
        if (element && element !== '') {
            const tt = element.split(';');
            const ttt = {
                Progressivo: +tt[0],
                Tag: tt[2]
            }
            this.tagsBrano.push(ttt);
        }
    });
    this.fMostraTag = true;
  }

  impostaTagArtista(artista) {
    // console.log(artista);
    const params = {
        Artista: artista
    };
    this.tagsArtista = new Array();
    this.caricamentoInCorso = true;
    this.apiService.RitornaTuttiTagArtista(params)
        .map(response => this.apiService.controllaRitorno(response))
        .subscribe(
            data => {
                this.caricamentoInCorso = false;
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                this.artistaSelezionato = artista;
                if (data2.indexOf('ERROR:') === -1) {
                    if (data2 && data2 !== '' && data2 !== '-') {
                    const dd = data2.split('§');
                    dd.forEach(element => {
                        if (element && element !== '') {
                            const d2 = element.split(';');
                            if (d2[0] !== '' && d2[1] !== '') {
                                const tt = {
                                    idTag: +d2[0],
                                    Tag: d2[1]
                                }
                                this.tagsArtista.push(tt);
                            }
                            this.fMostraTagArtista = true;
                        }
                    });
                }
            } else {
                this.fMostraTagArtista = true;
            }
        },
        (error) => {
        if (error instanceof Error) {
            this.utility.visualizzaMessaggio(this, 'Lettura Tags: ' + error.message, true);
        }
    });  
  }

  impostaTagArtistaAlbum(artista, album) {
    // Da implementare
  }

    eliminaTagArtista(idTag) {
        console.log(idTag);
        this.caricamentoInCorso = true;
        this.apiService.EliminaTagAdArtista(
          this.idUtenza,
          { 
            Artista: this.artistaSelezionato,
            idTag: idTag
          }
          ).map(response => this.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              if (data) {
                this.caricamentoInCorso = false;
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR:') === -1) {
                    const t = new Array();
                    this.tagsArtista.forEach(element => {
                      if (+element.idTag !== +idTag) {
                        t.push(element);
                      }
                    });
                    this.tagsArtista = t;
          
                  this.aggiornaTag();
    
                  this.sistemaTagAListaBrani();
    
                  this.utility.visualizzaMessaggio(this, data2, true);
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

    aggiungeTagArtista() {
        this.mostraAggiungeTag = true;

        this.aggiornaTag();
    }

    aggiornaTag() {
        this.listaTagsVisualizzati = new Array();
        this.listaTags.forEach(element => {
            let ok = 'true';
            if (this.tagsArtista) {
                this.tagsArtista.forEach(element2 => {
                    if (ok === 'true' && +element.idTag === +element2.idTag) {
                        ok = 'false';
                    }
                });
            }
            if (ok === 'true') {
                this.listaTagsVisualizzati.push(element);
            }
        });
        // console.log(this.listaTagsVisualizzati);
    }

  selezionaTag(id, testo) {
    this.caricamentoInCorso = true;
    this.apiService.AggiungeTagAdArtista(
      this.idUtenza,
      { 
        Artista: this.artistaSelezionato,
        idTag: id
      }
      ).map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          if (data) {
            this.caricamentoInCorso = false;
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            if (data2.indexOf('ERROR:') === -1) {
                if (testo !== '') {
                    let progressivo = 0;
                    this.tagsArtista.forEach(element => {
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
                    this.tagsArtista.push(tt);
                }

              this.aggiornaTag();

              this.sistemaTagAListaBrani();

              this.utility.visualizzaMessaggio(this, data2, true);
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

  eliminaTagDaLista(id) {
    this.apiService.EliminaTag(
      { 
        idTag: id
      }
      ).map(response => this.apiService.controllaRitorno(response) )
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

  refreshTagArtista() {
    let id = '';
    this.tagsArtista.forEach(element => {
        id += element.idTag + ';';
    });
    if (id.length > 0) {
        id = id.substring(0, id.length - 1);
        this.selezionaTag(id, '');
    }
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
  
  sistemaTagAListaBrani() {
    // console.log(this.braniFiltrati);
    // console.log(this.artista);
    // console.log(this.album);
    // console.log(this.titoloBrano);
    this.brani.forEach(element => {
      if (element.text === this.artistaSelezionato) {
        // console.log('Trovato artista', element);
        const albums = element.children;
        albums.forEach(element2 => {
            const brani = element2.children;
            brani.forEach(element3 => {
                let t = '';
                let progressivo = 1;
                this.tagsArtista.forEach(element4 => {
                    t += progressivo + ';' + element4.idTag + ';' + element4.Tag + '§';
                    progressivo++;
                });
                element3.tags = t;
            });
        });
      }
    });
    this.braniCambiati.emit(this.brani);
  }

  prendeTesto(b, artista, album) {
    let testo = '';

    testo += '<span style="margin-left: 30px; font-weight: bold;">Artista:</span> ' + artista + '<br />';
    testo += '<span style="margin-left: 30px; font-weight: bold;">Album:</span> ' + album + '<br />';
    testo += '<span style="margin-left: 30px; font-weight: bold;">Titolo:</span> ' + b.traccia + '-' + b.text + '<br />';
    if (this.deviceGirante === 'Android') {
      testo += '<img src="assets/immagini/hd4.png" width="25px" height="25px" />&nbsp;<span style="font-weight: bold;">Brano in locale</span>: ' + (b.locale === true ? 'Sì' : 'No') + '<br />';
    }
    testo += '<img src="assets/immagini/ascoltata.png" width="25px" height="25px" />&nbsp;<span style="font-weight: bold;">Ascoltato:</span> ' + b.ascoltata + '<br />';
    testo += '<img src="assets/immagini/preferito.png" width="25px" height="25px" />&nbsp;<span style="font-weight: bold;">Bellezza:</span> ' + b.stelle + '<br />';

    const t = b.tags.split('§');
    let tags = '';
    let q = 0;
    t.forEach(element => {
      if (element && element !== '') {
          const tt = element.split(';');
          tags += tt[2] + '; ';
          q++;
          if (q === 2) {
            q = 0;
            tags += '<br /><span style="margin-left: 30px;>&nbsp;</span>';
          }
      }
    });
    testo += '<img src="assets/immagini/icona_info.png" width="25px" height="25px" />&nbsp;<span style="font-weight: bold;">Tags:</span> ' + tags + '<br />';

    return this.sanitizer.bypassSecurityTrustHtml(testo);
  }

  mostraInfos(b, artista, album) {
    this.testoPopup = this.prendeTesto(b, artista, album);

    this.fMostraTag = true;
  }

  aprePopup(e, info) {
    if (this.deviceGirante === 'Android') {
      return;
    }
    // console.log(e, e.y, e.x);
    this.posY = e.y;
    this.posX = e.x;
    this.testoPopup = info;
  }
}  