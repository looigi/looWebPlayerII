import { AfterViewInit, Component, Input, OnChanges, OnInit } from "@angular/core";
import { fade } from "../animations";
import { ApiService } from "../services/api2.service";
import { UtilityComponent } from "../varie/utility.component";

@Component({
    selector: 'app-immagini',
    templateUrl: './gestioneimmagini.component.html',
    styleUrls: ['./gestioneimmagini.component.css'],
    animations: fade
})

export class ImmaginiComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() immagini;
    @Input() urlWS;
    @Input() Amministratore;

    immaginiArtista;
    visualizzaImmagine = false;
    testoImmagine;
    immagine;
    immagineVisualizzata;

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
        if (e.immagini) {
            this.immaginiArtista = new Array();
            if (e.immagini.currentValue) {
                e.immagini.currentValue.forEach(element => {
                    if (element.Immagine.toUpperCase().indexOf('COVER') === -1) {
                        let path = '';
                        if (element.Cartella.toUpperCase().indexOf('GIF') === -1) {
                            path = this.apiService.ritornaUrlImmagine() + 'Immagini/' + element.Artista + '/' +
                                element.Cartella + '/' + element.Immagine;
                        } else {
                            path = this.apiService.ritornaUrlImmagine() + 'Gifs/' + element.Artista +
                                '/' + element.Immagine;
                        }
                        this.immaginiArtista.push({ Immagine: path, Nome: element.Immagine });
                    }
                });
                this.immaginiArtista.sort((a, b) => a.Nome - b.Nome);
                // console.log(this.immaginiArtista);
            }
        }
    }

    premutaImmagine(i, e, n) {
      // console.log(n);
      this.visualizzaImmagine = true;
      this.immagineVisualizzata = n;
      this.prendeImmagine();
    }

    prendeImmagine() {
      const i = this.immaginiArtista[this.immagineVisualizzata];
      this.immagine = i.Immagine;
      this.testoImmagine = i.Nome + ' Imm. ' + (this.immagineVisualizzata + 1)  + '/' + this.immaginiArtista.length;
    }

    indietroImmagine() {
      this.immagineVisualizzata--;
      if (this.immagineVisualizzata < 0) {
        this.immagineVisualizzata = this.immaginiArtista.length - 1;
      }
      this.prendeImmagine();
    }

    avantiImmagine() {
      this.immagineVisualizzata++;
      if (this.immagineVisualizzata > this.immaginiArtista.length - 1) {
        this.immagineVisualizzata = 0;
      }
      this.prendeImmagine();
    }

    eliminaImmagine() {
        if (this.immagine === '') {
            alert('Nessuna immagine presente');
            return;
          }
          let imm = this.immagine;
          imm = imm.replace(this.urlWS, '');
          imm = imm.replace('Brani/', '');
          imm = imm.replace('Immagini/', '');
          console.log(imm);

          this.apiService.eliminaImm(
            imm
          ).map(response => this.apiService.controllaRitorno(response))
          .subscribe(
            data => {
              if (data) {
                const data2 = this.apiService.prendeSoloDatiValidi(data);
                if (data2.indexOf('ERROR:') === -1) {
                  this.utility.visualizzaMessaggio(this, 'Immagine eliminata', false);
                  // this.visualizzaImmagine = false;
                  const i = new Array();
                  this.immaginiArtista.forEach(element => {
                      if (element.Immagine !== this.immagine) {
                        i.push(element);
                      }
                  });
                  this.immaginiArtista = JSON.parse(JSON.stringify(i));
                  this.prendeImmagine();
                } else {
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

    scaricaImmagine() {
        let imm = this.immagine;
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
              // console.log(data2);
              if (data2.indexOf('ERROR:') === -1) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", this.immagine, true);
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
 
    getUrl() {
        // console.log('url(\'' + this.immagineSfondo.replace('\'', '%27').replace(' ', '%20') + '\')');
        return 'url(\'' + this.immagine.replace('\'', '%27').replace(' ', '%20') + '\')';
    }
       
}