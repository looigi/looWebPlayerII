import { AfterViewInit, Injectable, OnChanges, OnInit } from "@angular/core";
import {throwError as observableThrowError, Observable} from 'rxjs';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { map } from "rxjs/operators";
import { ApiService } from "../services/api2.service";
import { HttpService } from "../services/httpclient.service";
import { MusixMatchComponent } from "./musixmatch.component";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class HappiComponent implements OnInit, AfterViewInit, OnChanges {
    chiave = '6fc0bc7j7XUiCrggzyGJN4mCVDvUA1mo7ylOvhALhgKZxs8oy0wQsfbt';
    ultimaVoltaTMS = -1;
    tt;
    idBranoT;
    ArtistaT;
    AlbumT;
    TracciaT;

    constructor(
        private apiService: ApiService,
        private http: HttpService,
        public utility: UtilityComponent,
        private MusixMatch: MusixMatchComponent
    ) {}

    ngOnInit() {
        
    }

    ngOnChanges() {

    }

    ngAfterViewInit() {

    }

    prendeArtista(t, idBrano, Artista: string, Album: string, Traccia: string) {
        const ora = new Date().getTime();
        if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
            return;
        }
        this.ultimaVoltaTMS = ora;

        this.tt = t;
        this.idBranoT = idBrano;
        this.ArtistaT = Artista;
        this.AlbumT = Album;
        this.TracciaT = Traccia;

        let idArtista = -1;
        let idAlbum = -1;
        let idTraccia = -1;
        let lyrics = '';

        if (t.debug === true) {
            console.log('Cerco testo: ', Artista, Album, Traccia);
        }
        this.prendeArtistaGet(t, Artista).subscribe(data => {
            const d = JSON.parse(data._body);
            // console.log(d);
            const result = d.result;
            result.forEach(element => {
                if (idArtista === -1 && element.artist.trim().toUpperCase().indexOf(Artista.trim().toUpperCase()) > -1) {
                    idArtista = element.id_artist;
                    if (t.debug === true) {
                        console.log('ID Artista:', idArtista);
                    }

                    this.prendeAlbumGet(t, idArtista).subscribe(data2 => {
                        const d = JSON.parse(data2._body);
                        const result = d.result.albums;
                        result.forEach(element => {
                            if (idAlbum === -1 && element.album.trim().toUpperCase().indexOf(Album.trim().toUpperCase()) > -1) {
                                idAlbum = element.id_album;
                                if (t.debug === true) {
                                    console.log('ID Album:', idAlbum);
                                }

                                this.prendeTracciaGet(t, idArtista, idAlbum).subscribe(data3 => {
                                    const d = JSON.parse(data3._body);
                                    // console.log('Tracce', d, Traccia);
                                    const result = d.result.tracks;
                                    result.forEach(element => {
                                        if (idTraccia === -1 && element.track.trim().toUpperCase().indexOf(Traccia.trim().toUpperCase()) > -1) {
                                            idTraccia = element.id_track;
                                            if (t.debug === true) {
                                                console.log('ID Traccia:', idTraccia);
                                            }
                                            
                                            this.prendeLyricsGet(t, idArtista, idAlbum, idTraccia).subscribe(data4 => {
                                                if (data4.ok) {
                                                    const d = JSON.parse(data4._body);
                                                    // console.log(d);
                                                    
                                                    lyrics = d.result.lyrics;
                                                    lyrics = Artista.toUpperCase() + '<br />' + Traccia.toUpperCase() + '<br /><br />' + lyrics;

                                                    t.testo = lyrics;
                                                    t.testoTradotto = '';

                                                    let lyrics2 = lyrics;
                                                    while(lyrics2.indexOf('&') > -1) {
                                                        lyrics2 = lyrics2.replace('&', '-AND-');
                                                    }
                                                    while(lyrics2.indexOf('?') > -1) {
                                                        lyrics2 = lyrics2.replace('?', '-PI-');
                                                    }
                                                    while(lyrics2.indexOf('/') > -1) {
                                                        lyrics2 = lyrics2.replace('/', '-SL-');
                                                    }
                                                    while(lyrics2.indexOf('\\') > -1) {
                                                        lyrics2 = lyrics2.replace('\\', '-CS-');
                                                    }
                                                    while(lyrics2.indexOf('=') > -1) {
                                                        lyrics2 = lyrics2.replace('=', '-UG-');
                                                    }
                                                    while(lyrics2.indexOf('(') > -1) {
                                                        lyrics2 = lyrics2.replace('(', '-PA-');
                                                    }
                                                    while(lyrics2.indexOf(')') > -1) {
                                                        lyrics2 = lyrics2.replace(')', '-PC-');
                                                    }
                                                    while(lyrics2.indexOf('<') > -1) {
                                                        lyrics2 = lyrics2.replace('<', '-MIN-');
                                                    }
                                                    while(lyrics2.indexOf('>') > -1) {
                                                        lyrics2 = lyrics2.replace('>', '-MAX-');
                                                    }

                                                    if (t.debug === true) {
                                                        console.log('Traccia acquisita');
                                                    }
        
                                                    this.apiService.ScriveTesto(
                                                        { 
                                                          idCanzone: idBrano,
                                                          Testo: lyrics2
                                                        }
                                                      ).map(response => this.apiService.controllaRitorno(response))
                                                      .subscribe(
                                                        data => {
                                                          if (data) {
                                                            const data2 = this.apiService.prendeSoloDatiValidi(data);
                                                            // console.log(data2);
                                                            if (data2.indexOf('ERROR:') === -1) {
                                                            } else {                                                                
                                                            }
                                                          }
                                                        },
                                                        (error) => {
                                                        }
                                                      );
                                                  
                                                    // console.log(lyrics);
                                                } else {
                                                    // nessuan lyrics rilevata
                                                    this.MusixMatch.prendeArtista(t, idBrano, Artista, Album, Traccia);
                                                }
                                            });    
                                        }
                                    });
                                    if (idTraccia === -1) {
                                        // nessuna traccia rilevata
                                        this.MusixMatch.prendeArtista(t, idBrano, Artista, Album, Traccia);
                                    }
                                });    
                            }
                        });
                        if (idAlbum === -1) {
                            // Nessun album rilevato
                            this.MusixMatch.prendeArtista(t, idBrano, Artista, Album, Traccia);
                        }
                    });    
                }
            });
            if (idArtista === -1) {
                // Nessun artista rilevato
                this.MusixMatch.prendeArtista(t, idBrano, Artista, Album, Traccia);
            }
        });
    }

    private prendeArtistaGet(t, Artista): Observable<any> {
        const url = 'https://api.happi.dev/v1/music?q=' + Artista + '&limit=&apikey=' + this.chiave + '&type=artist&lyrics=0'
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeAlbumGet(t, Album): Observable<any> {
        const url = 'https://api.happi.dev/v1/music/artists/' + Album + '/albums?apikey=' + this.chiave
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeTracciaGet(t, Artista, Album): Observable<any> {
        const url = 'https://api.happi.dev/v1/music/artists/' + Artista + '/albums/' + Album + '/tracks?apikey=' + this.chiave
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeLyricsGet(t, Artista, Album, Traccia): Observable<any> {
        const url = 'https://api.happi.dev/v1/music/artists/' + Artista + '/albums/' + Album + '/tracks/' + Traccia + '/lyrics?apikey=' + this.chiave
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private catchAuthError() {
        // console.log('Errore: ', self);
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
          // console.log('ERRORE Http: ', res);
          if (res.status === 404) {
            this.MusixMatch.prendeArtista(this.tt, this.idBranoT, this.ArtistaT, this.AlbumT, this.TracciaT);
          }
          return observableThrowError(res);
        };
    }
}