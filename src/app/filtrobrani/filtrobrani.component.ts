import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { fade } from "../animations";
import { ApiService } from "../services/api2.service";
import { UtilityComponent } from "../varie/utility.component";

@Component({
    selector: 'app-filtro',
    templateUrl: './filtrobrani.component.html',
    styleUrls: ['./filtrobrani.component.css'],
    animations: fade
})

export class FiltroComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() mascheraFiltroBrani: boolean = false;
    @Input() deviceGirante;
    @Input() mascheraOpzioni;
    @Input() mascheraTesto;
    @Input() fFiles;
    @Input() braniFiltrati;
    @Input() storage;
    @Input() eliminaMamma;
    @Input() canzoniLocali;
    @Input() canzoniMamma;
    @Input() consideraStelle;
    @Input() maiVotate;
    @Input() isConnected;
    @Input() tt;
    @Input() filtroImpostato;
    @Input() quantiBraniFiltrati = 0;
    @Input() numeroStelle = 6;
    @Input() tags;
    @Input() listaTags;
    @Input() esclusioni;
    @Input() zIndex;
    
    @Output() mascheraFiltroBraniEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() fFilesEmit: EventEmitter<any> = new EventEmitter();
    @Output() braniFiltratiEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() eliminaMammaEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() canzoniLocaliEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() canzoniMammaEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() consideraStelleEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() maiVotateEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() filtroImpostatoEmit: EventEmitter<string> = new EventEmitter();
    @Output() numeroStelleEmit: EventEmitter<number> = new EventEmitter();
    @Output() tagsEmit: EventEmitter<any> = new EventEmitter();
    @Output() esclusioniEmit: EventEmitter<string> = new EventEmitter();

    mostraAggiungeTag = false;
    listaTagsVisualizzati;
    nuovoTag = '';

    constructor(
        private apiService: ApiService,
        public utility: UtilityComponent,    
    ) {
      // alert('ppp');
    }

    ngOnInit(): void {
      // alert('ppp2');
    }

    ngAfterViewInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
      // alert('ppp3');
    }

    cambiaFiltro(e) {
        // this.storage.cambiaFiltro2(this.tt, e);
        this.filtroImpostatoEmit.emit(e); 
        this.filtroImpostato = e;
        this.storage.cambiaFiltro2(this.tt, e);
        // console.log('Filtro: ', e);
    }

    cambiaEsclusioni(e) {
      this.storage.cambiaEsclusioni(this.tt, e);
      this.esclusioniEmit.emit(e); 
      this.esclusioni = e;
      // console.log('Filtro: ', e);
  }

  eliminaTag(t) {
        const tt = new Array();
        this.tags.forEach(element => {
            if (element !== t) {
                tt.push(element);
            }
        });
        this.tags = tt;
        this.tagsEmit.emit(tt);
        this.storage.checkTagsRicerca(this.tt, this.tags);
        this.aggiornaTag();
    }

    aggiungeTagRicerca() {
        this.aggiornaTag();
        this.mostraAggiungeTag = true;
    }

    aggiornaTag() {
        // console.log(this.tags);
        this.listaTagsVisualizzati = new Array();
        this.listaTags.forEach(element => {
          let ok = 'true';
          if (this.tags) {
            this.tags.forEach(element2 => {
                const ele = element2.replace("'", "").replace("'","").replace("\"", "").replace("\"","");
                if (ok === 'true' && element.Tag === ele) {
                    ok = 'false';
                }
            });
          }
          if (ok === 'true') {
            this.listaTagsVisualizzati.push(element);
          }
        });
    }
    
    selezionaTag(id, tag) {
      console.log(tag);
        this.tags.push(tag);
        this.tagsEmit.emit(this.tags);
        this.storage.checkTagsRicerca(this.tt, this.tags);
        this.aggiornaTag();
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
              this.tags.forEach(element => {
                if (+element.idTag !== +id) {
                  l2.push(element);
                }
              });
              this.tags = l2;

              this.tagsEmit.emit(this.tags);
              this.storage.checkTagsRicerca(this.tt, this.tags);
              this.aggiornaTag();      
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
}