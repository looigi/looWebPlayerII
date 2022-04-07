import { Inject, Injectable, OnInit } from "@angular/core";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class YouTubeComponent implements OnInit {
  constructor(
    private utility: UtilityComponent,
  ) {

  }

    ngOnInit() {

    }

    prendeVideoYouTube(t, refresh) {
        if (refresh === 'S') {
          if (!confirm('Si vogliono scaricare nuovamente i video ?')) {
            return;
          }
        }
        t.staCaricandoVideo = true;
        t.videoSource = '';
        console.log('Sta suonando', t.staSuonando, t.audio);
        if (t.staSuonando && t.audio) {
            // if (t.interval) {
            // t.pauseTimer();
            // t.interval = undefined;
            // }
            t.audio.pause();
        }
    
        t.youTubeVideos = new Array();

        setTimeout(() => {
          // Acquisizione youtube video
          const params = {
            nomeArtista: t.artista,
            nomeBrano: t.titoloBrano,
            refresh: refresh
          };
    
          t.scriveDebug('Carico brano. 10... Carico filmati youtube');
      
          t.apiService.ritornaYouTube(
            params
          ).map(response => response.text())
          .subscribe(
            data => {
              if (data) {
                t.staCaricandoVideo = false;
                if (t.staSuonando && t.audio) {
                  t.audio.play();
                  if (t.videoNONCaricato === true) {
                    if (t.videoplayer) {
                      t.videoplayer.playVideo();
                    }
                  } else {
                    if (t.videoplayerLocale) {
                      // this.videoplayerLocale.nativeElement.mute();
                      t.videoplayerLocale.nativeElement.play();
                    }
                  }
                  t.posizioneBrano = 0;
                  t.startTimer();
                }
            
                const data3 = t.apiService.prendeSoloDatiValidi(data);
                // console.log(data2);
                t.scriveDebug('Carico brano. 11... Caricati filmati youtube');
            
                if (data3.indexOf('ERROR:') === -1) {
                  const data33 = data3.split('|');
                  const data2 = data33[0];
                  const numeroVideoDefault = +data33[1];
    
                  const r = data2.split('§');
                  r.forEach(element => {
                    if (element) {
                      const rrr = element.split(';');
    
                      let nomeLink = rrr[0];
                      while (nomeLink.indexOf('=') > -1) {
                        nomeLink = nomeLink.substring(rrr[0].indexOf('=') + 1, rrr[0].Length)
                      }
                      const rr = {
                        linkVideo: nomeLink,
                        nomeVideo: rrr[1],
                        estensione: rrr[2],
                        prefisso: rrr[3],
                        Esiste: rrr[4],
                        pathUrl: rrr[5]
                      };
                      t.youTubeVideos.push(rr);
                    }
                  });
                  t.scriveDebug('Carico brano. 12... Carico filmati youtube. Filmati ' + t.youTubeVideos.length);
              
                  // console.log(t.youTubeVideos);
                  if (t.youTubeVideos.length > 0) {
                    let rnum = -1;
                    // if (numeroVideoDefault === -1) {
                    let q = 0;
                    t.youTubeVideos.forEach(element => {
                      if (rnum === -1 && element.Esiste === 'S') {
                        rnum = q;
                      }
                      q++;
                    });
                    if (rnum === -1) {
                      rnum = Math.floor(Math.random() * t.youTubeVideos.length - 1);
                    }
                      // while (!t.youTubeVideos[rnum]) {
                      // rnum = Math.floor(Math.random() * t.youTubeVideos.length - 1);
                      // }
                    // } else {
                    //   rnum = numeroVideoDefault;
                    // }
    
                    t.scriveDebug('Carico brano. 13... Impostato video ' + rnum);
                
                    t.scritte.push('Video you tube: ' + rnum + '/' + (t.youTubeVideos.length - 1));
                    t.numeroVideo = rnum;
                    t.staCaricandoVideo = false;
                    setTimeout(() => {
                      // console.log('Video caricato:', t.youTubeVideos[rnum]);
                      if (t.youTubeVideos && t.youTubeVideos[rnum]) {
                        if (t.youTubeVideos[rnum].Esiste === 'S') {
                          t.videoNONCaricato = false;
                          t.videoSource = t.urlWS + t.youTubeVideos[rnum].pathUrl;
                        } else {
                          t.videoNONCaricato = true;
                          t.videoSource = t.youTubeVideos[rnum].linkVideo;
                        }
                        // console.log(t.videoSource);
                        setTimeout(() => {
                          // console.log(t.posizioneBrano);
                          if (t.videoNONCaricato === true) {
                            if (t.videoplayer) {
                              t.videoplayer.mute();
                              if (t.staSuonando === true) {                              
                                t.scriveDebug('Carico brano. 14... Play youtube');
                            
                                t.videoplayer.playVideo();
                                if (t.videoplayer) {
                                  setTimeout(() => {
                                    t.videoplayer.seekTo(+t.posizioneBrano, true);
                                  }, 100);
                                }
    
                                /* setTimeout(() => {
                                  t.videoplayer.seekTo(+t.posizioneBrano, false);                                      
                                }, 1000); */
                              }
                            }
                          } else {
                            if (t.videoplayer) {
                              // t.videoplayerLocale.nativeElement.mute();
                              if (t.staSuonando === true) {                              
                                t.scriveDebug('Carico brano. 15... Play youtube');
                            
                                t.videoplayerLocale.nativeElement.play();
                                setTimeout(() => {
                                  t.videoplayerLocale.nativeElement.currentTime = +t.posizioneBrano;
                                }, 1000);
                              }
                            }
                          }
                        }, 1000);
                      }
                    }, 100);
                  }
                } else {
                  t.scriveDebug('Carico brano. 15... Errore filmati youtube: ' + data3);
              
                  console.log(data3);
                  t.youTubeVideos = new Array();
                }
              } else {
                t.staCaricandoVideo = false;
                if (t.staSuonando) {
                  t.audio.play();
                }
              }
            });                            
          // Acquisizione youtube video
        }, 1000);
    }

    avanzaVideo(t) {
        let rnum = t.numeroVideo + 1;
        if (rnum > t.youTubeVideos.length - 1) {
          rnum = 0;
        }
        t.numeroVideo = rnum;
        this.utility.visualizzaMessaggio(t, 'Video caricato ' + rnum + '/' + (t.youTubeVideos.length -1) + '\n' + t.youTubeVideos[rnum].pathUrl, false);
        
        if (t.debug === true) {
          console.log('Avanza video', t.numeroVideo);
        }
    
        this.settaVideo(t);
    }
    
    indietroVideo(t) {
        let rnum = t.numeroVideo - 1;
        if (rnum < 0) {
          rnum = t.youTubeVideos.length - 1;
        }
        t.numeroVideo = rnum;
        this.utility.visualizzaMessaggio(t, 'Video caricato ' + rnum + '/' + (t.youTubeVideos.length -1) + '\n' + t.youTubeVideos[rnum].pathUrl , false);
        
        if (t.debug === true) {
          console.log('Indietro Video',t.numeroVideo);
        }
    
        this.settaVideo(t);
    }
    
    settaVideo(t) {
        t.staCaricandoVideo = false;
        setTimeout(() => {
          // t.numeroVideo = t.numeroVideo;
          if (t.youTubeVideos && t.youTubeVideos[t.numeroVideo]) {
            if (t.youTubeVideos[t.numeroVideo].Esiste === 'S') {
              t.videoNONCaricato = false;
              t.videoSource = t.urlWS + t.youTubeVideos[t.numeroVideo].pathUrl;
            } else {
              t.videoNONCaricato = true;
              t.videoSource = t.youTubeVideos[t.numeroVideo].linkVideo;
            }
          if (t.debug === true) {
              console.log('Video impostato', t.videoSource, t.numeroVideo, t.youTubeVideos.length);
            }
            t.scritte.forEach(element => {
              if (element.indexOf('Video you tube') > -1) {
                element = 'Video you tube: ' + t.numeroVideo + '/' + (t.youTubeVideos.length - 1);
              }
            });
    
            setTimeout(() => {
              if (t.videoNONCaricato === true) {
                t.videoplayer.mute();
                if (t.staSuonando === true) {                              
                  setTimeout(() => {
                    t.videoplayer.playVideo();
                  }, 1000);
                }
              } else {
                // t.videoplayerLocale.nativeElement.mute();
                if (t.staSuonando === true) {                              
                  setTimeout(() => {
                    t.videoplayerLocale.nativeElement.play();
                  }, 1000);
                }
              }
            }, 1000);
          }
        } , 500);
    }
    
    salvaVideo(t) {
        if (!t.youTubeVideos[t.numeroVideo]) {
          return;
        }
        let nomeVideo = t.youTubeVideos[t.numeroVideo].linkVideo;
        nomeVideo = 'https://www.youtube.com/watch?' + t.youTubeVideos[t.numeroVideo].prefisso + '=' +
          nomeVideo + t.youTubeVideos[t.numeroVideo].estensione;
        console.log('Video da salvare:', t.youTubeVideos[t.numeroVideo].prefisso, t.youTubeVideos[t.numeroVideo].linkVideo, t.youTubeVideos[t.numeroVideo].estensione);
    
        t.apiService.salvaVideo(
          t.youTubeVideos[t.numeroVideo].prefisso, 
          t.youTubeVideos[t.numeroVideo].linkVideo,
          t.youTubeVideos[t.numeroVideo].estensione
        ).map(response => response.text())
          .subscribe(
          data => {
            if (data) {
              const data2 = t.apiService.prendeSoloDatiValidi(data);
              // console.log(data2);
              if (data2.indexOf('ERROR:') === -1) {
                setTimeout(() => {
                  t.youTubeVideos[t.numeroVideo].Esiste = 'S';
                  t.videoNONCaricato = false;
                  const prima = t.youTubeVideos[t.numeroVideo].linkVideo.substring(0, 1);
                  t.videoSource = t.urlWS + 'YouTube/' + prima + '/' + t.youTubeVideos[t.numeroVideo].linkVideo +
                    t.youTubeVideos[t.numeroVideo].estensione;
                  console.log('Video scaricato', t.videoSource);
    
                  if (t.staSuonando) {
                    setTimeout(() => {
                      if (t.videoplayerLocale) {
                        // t.videoplayerLocale.nativeElement.mute();
                        t.videoplayerLocale.nativeElement.play();
                        setTimeout(() => {
                          t.videoplayerLocale.nativeElement.currentTime = +t.posizioneBrano;
                        }, 1000);
                      }
                    }, 1000);
                  }
          
                  this.utility.visualizzaMessaggio(t, 'Video salvato', false);
                }, 1000);
              } else {
                t.apiService.scriveVideoDaSalvare(
                  nomeVideo
                ).map(response => response.text())
                  .subscribe(
                  data => {
                    if (data) {
                      const data2 = t.apiService.prendeSoloDatiValidi(data);
                      console.log(data2);
                      if (data2.indexOf('ERROR:') === -1) {
                        // console.log('Video inserito nella lista da scaricare');
                        this.utility.visualizzaMessaggio(t, 'Video inserito nella lista da scaricare', true);
                      } else {
                        // alert(data2);
                        this.utility.visualizzaMessaggio(t, 'Salva Video: ' + data2, true);
                      }
                    }
                  },
                  (error) => {
                    if (error instanceof Error) {
                      this.utility.visualizzaMessaggio(t, 'Salva Video: ' + error.message, true);
                    }
                  }
                );
              }
    
              t.apiService.SalvaVideoDefault(
                t.numeroBrano,
                t.numeroVideo
              ).map(response => response.text())
                .subscribe(
                data => {
                  if (data) {
                    const data2 = t.apiService.prendeSoloDatiValidi(data);
                    if (data2.indexOf('ERROR:') === -1) {
                      console.log('Video salvato come default');
                    } else {
                      // console.log(data2);
                      this.utility.visualizzaMessaggio(t, 'Salva Video: ' + data2, true);
                    }
                  }
              });      
            }
          },
          (error) => {
            if (error instanceof Error) {
              this.utility.visualizzaMessaggio(t, 'Salva Video: ' + error.message, true);
            }
          }
        );
    }
    
}
