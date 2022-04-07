import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { fade } from "../animations";
import { ApiService } from "../services/api2.service";
import { UtilityComponent } from "../varie/utility.component";

@Component({
    selector: 'app-album',
    templateUrl: './gestionealbum.component.html',
    styleUrls: ['./gestionealbum.component.css'],
    animations: fade
})

export class AlbumComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() datiAlbum;
    @Input() urlImmagine;
    @Input() idUtenza;
    @Input() Amministratore;

    @Output() datiJsonRitornati: EventEmitter<Number> = new EventEmitter();

    album;
    immagineAlbum;
    nomeAlbum;
    artista;
    cartella;
    tipologia = '';
    vecchioNome = '';
    mascheraRinomina = false;
    mascheraImmAlbum = false;
    nuovoNome = '';
    nuovoNumero = '';
    origine;
    immAlbum;
    pathImmagini;
    scaricamentoImmagine = false;

    constructor(
        private utility: UtilityComponent,
        private apiService: ApiService
    ) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnChanges(e) {
        if (e.datiAlbum) {
            if (e.datiAlbum.currentValue) {
                this.album = e.datiAlbum.currentValue;
                let anno = this.album.anno;
                for (let i = anno.length + 1; i <= 4; i++) {
                  anno = '0' + anno;
                }
                this.artista = this.album.artista;
                this.nomeAlbum = this.album.album;
                this.cartella = anno + '-' + this.album.album;
                this.immagineAlbum = this.apiService.ritornaUrlImmagine() + 'Immagini/' + this.artista + '/' +
                    this.cartella + '/Cover_' + this.artista + '.jpg';

                // console.log(this.album);
            }
        }

        if (e.urlImmagine) {
          if (e.urlImmagine.currentValue) {
            this.pathImmagini = e.urlImmagine.currentValue;
            // console.log('Percorso immagini', this.pathImmagini);
          }
        }
    }

    eliminaBrano(b) {
        console.log(b);
    }

    rinominaBrano(b) {
        // console.log(b);
        this.origine = b;
        this.vecchioNome = b.Text;
        this.nuovoNome = this.vecchioNome;
        this.nuovoNumero = b.Traccia;
        this.tipologia = 'Brano';
        this.mascheraRinomina = true;
    }

    eliminaAlbum() {
        console.log(this.album, this.nomeAlbum);
    }

    rinominaAlbum() {
        // console.log(this.album, this.nomeAlbum);
        this.origine = this.album;
        this.vecchioNome = this.nomeAlbum;
        this.nuovoNome = this.vecchioNome;
        this.nuovoNumero = this.album.anno;
        this.tipologia = 'Album';
        this.mascheraRinomina = true;
    }

    salvaRinomina() {
        if (this.tipologia === 'Brano') {
            this.apiService.RinominaBrano(
              this.idUtenza,
              {
                    Artista: this.artista,
                    Album: this.nomeAlbum,
                    Brano: this.origine.Text,
                    NuovaTraccia: this.nuovoNumero,
                    NuovoNomeBrano: this.nuovoNome
                }
              ).map(response => this.apiService.controllaRitorno(response))
              .subscribe(
                data => {
                  if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR:') === -1) {
                        this.datiJsonRitornati.emit(JSON.parse(data2));
                        this.mascheraRinomina = false;
                    } else {
                      this.utility.visualizzaMessaggio(this, 'Rinomina brano: ' + data2, true);
                    }
                  }
                },
                (error) => {
                  if (error instanceof Error) {
                    this.utility.visualizzaMessaggio(this, 'Rinomina brano: ' + error.message, true);
                  }
                }
            );          
        } else {
            this.apiService.RinominaAlbum(
              this.idUtenza,
              {
                    Artista: this.artista,
                    Album: this.origine.album,
                    NuovoAnno: this.nuovoNumero,
                    NuovoNomeAlbum: this.nuovoNome
                }
              ).map(response => this.apiService.controllaRitorno(response))
              .subscribe(
                data => {
                  if (data) {
                    const data2 = this.apiService.prendeSoloDatiValidi(data);
                    // console.log('Controllo immagine se esiste. Ritorno: ', data2);
                    if (data2.indexOf('ERROR:') === -1) {
                        this.datiJsonRitornati.emit(JSON.parse(data2));
                        this.mascheraRinomina = false;
                    } else {
                      this.utility.visualizzaMessaggio(this, 'Rinomina album: ' + data2, true);
                    }
                  }
                },
                (error) => {
                  if (error instanceof Error) {
                    this.utility.visualizzaMessaggio(this, 'Rinomina album: ' + error.message, true);
                  }
                }
            );          
      }
  }

  scaricaImmagineAlbum() {
    this.scaricamentoImmagine = true;
    this.apiService.ScaricaImmagineAlbum(
      {
          Artista: this.artista,
          Album: this.nomeAlbum,
          Anno: this.album.anno
      }
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log('Controllo immagine se esiste. Ritorno: ', data2);
          if (data2.indexOf('ERROR:') === -1) {
            const d = data2.split('§');
            const imm = new Array();
            d.forEach(element => {
              if (element) {
                const dd = element.split(';');
                const path = this.pathImmagini + 'Appoggio/ImmaginiAlbum/' + dd[0];
                imm.push({ Path: path, Nome: dd[0], Dimensioni: dd[1] });
              }
            });
            this.immAlbum = imm;

            // console.log(this.immAlbum);
            this.mascheraImmAlbum = true;
          } else {
            this.utility.visualizzaMessaggio(this, 'Scarica immagine album: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Scarica immagine album: ' + error.message, true);
        }
      }
    );          
  }

  impostaImmagineAlbum(imm) {
    console.log(imm);
    this.apiService.ImpostaImmagineAlbum(
      {
          Artista: this.artista,
          Album: this.nomeAlbum,
          Anno: this.album.anno,
          NomeImmagine: imm.Nome
      }
    ).map(response => this.apiService.controllaRitorno(response))
    .subscribe(
      data => {
        if (data) {
          const data2 = this.apiService.prendeSoloDatiValidi(data);
          // console.log('Controllo immagine se esiste. Ritorno: ', data2);
          if (data2.indexOf('ERROR:') === -1) {
            this.mascheraImmAlbum = false;
            this.scaricamentoImmagine = false;
          } else {
            this.utility.visualizzaMessaggio(this, 'Scarica immagine album: ' + data2, true);
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          this.utility.visualizzaMessaggio(this, 'Scarica immagine album: ' + error.message, true);
        }
      }
    );          
  }
}