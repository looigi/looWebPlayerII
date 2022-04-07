import { AfterViewInit, Injectable, OnChanges, OnInit } from "@angular/core";
import {throwError as observableThrowError, Observable} from 'rxjs';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { map } from "rxjs/operators";
import { ApiService } from "../services/api2.service";
import { HttpService } from "../services/httpclient.service";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class MusixMatchComponent implements OnInit, AfterViewInit, OnChanges {
    chiave = 'e79c8738286330240a3492c4de967cb7';
    ultimaVoltaTMS = -1;

    constructor(
        private apiService: ApiService,
        private http: HttpService,
        public utility: UtilityComponent,
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

            const result = d.message.body.artist_list;
            result.forEach(element => {
                if (idArtista === -1 && element.artist.artist_name.trim().toUpperCase().indexOf(Artista.trim().toUpperCase()) > -1) {
                    idArtista = element.artist.artist_id;
                    if (t.debug === true) {
                        console.log('ID Artista:', idArtista);
                    }

                    this.prendeAlbumGet(t, idArtista).subscribe(data2 => {
                        const d = JSON.parse(data2._body);
                        // console.log(d);

                        const result = d.message.body.album_list;
                        result.forEach(element => {
                            if (idAlbum === -1 && element.album.album_name.trim().toUpperCase().indexOf(Album.trim().toUpperCase()) > -1) {
                                idAlbum = element.album.album_id;
                                if (t.debug === true) {
                                    console.log('ID Album:', idAlbum);
                                }

                                this.prendeTracciaGet(t, idAlbum).subscribe(data3 => {
                                    const d = JSON.parse(data3._body);
                                    // console.log(d);

                                    const result = d.message.body.track_list;
                                    result.forEach(element => {
                                        if (idTraccia === -1 && element.track.track_name.trim().toUpperCase().indexOf(Traccia.trim().toUpperCase()) > -1) {
                                            idTraccia = element.track.track_id;
                                            if (t.debug === true) {
                                                console.log('ID Traccia:', idTraccia);
                                            }
                                            
                                            this.prendeLyricsGet(t, idTraccia).subscribe(data4 => {
                                                const d = JSON.parse(data4._body);
                                                console.log(d);
                                                return;
                                                
                                                if (data4.ok) {
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
                                                }
                                            });    
                                        }
                                    });
                                });    
                            }
                        });
                    });    
                }
            });
        });
    }

    private prendeArtistaGet(t, Artista): Observable<any> {
        const url = 'https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/artist.search?apikey=' + this.chiave + '&q_artist=' + Artista + '&page_size=5'
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeAlbumGet(t, idArtista): Observable<any> {
        const url = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.albums.get?apikey=' + this.chiave + '&artist_id=' + idArtista + '&s_release_date=desc&g_album_name=1'
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeTracciaGet(t, idAlbum): Observable<any> {
        const url = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=' + this.chiave + '&album_id=' + idAlbum + '&page=1&page_size=2'
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private prendeLyricsGet(t, idTraccia): Observable<any> {
        const url = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=' + this.chiave + '&track_id=' + idTraccia
        
        return this.http.get(t, url).catch(this.catchAuthError());
    }

    private catchAuthError() {
        // console.log('Errore: ', self);
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
          // console.log('ERRORE Http: ', res);
          if (res.status === 404) {
          }
          return observableThrowError(res);
        };
    }
}