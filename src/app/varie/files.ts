import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { Component, Injectable, OnInit } from "@angular/core";
import { File } from '@ionic-native/file/ngx';
import { resolve } from "dns";

// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file/ngx';

declare let downloader: any;

@Injectable()
export class ComponentFile implements OnInit {
  static cartelletta = '';
  static pathBrano = '';
  static titolone = '';
  static modalita = '';
  static operazioneSuFile = '';
  static percorsoFileSD = '';
  static percorsoFileSDProssimo = '';
  static filesInMemoria = new Array();
  // static profondita = 0;
  // static staLeggendoFiles = [false, false, false, false, false, false, false, false, false, false, false];
  static percorsoImmagineSD = '';
  static pathJson = ['', '', '', '', '', '', '', '', ''];
  static fileNameJson = ['', '', '', '', '', '', '', '', ''];
  static fileNameJsonDaEliminare = ['', '', '', '', '', '', '', '', ''];
  static blobJson = ['', '', '', '', '', '', '', '', ''];
  static fileJSON = ['', '', '', '', '', '', '', '', ''];
  static giaEliminati = false;
  static esisteFile = ['', '', '', '', '', '', '', '', ''];
  static appoggioFile = '';
  static pathSD = 'file:///storage/emulated/0/';
  static interrompiDownload = false;
  static staScaricandoFile = false;

  index = 0;
  profondita = 0;

  constructor(
    private file: File
  ) {

  }

  ngOnInit() {
  }
  
  downloadImmagine(t, pathBrano, cartelletta, titolone) {
    return new Promise(async (Ritorno) => {
      ComponentFile.pathBrano = pathBrano;
      ComponentFile.cartelletta = cartelletta;
      ComponentFile.titolone = titolone;
      ComponentFile.modalita = 'DOWNLOADIMMAGINE';

      const pathFile = ComponentFile.pathSD + cartelletta + '/' + titolone;
      t.utility.scriveDebug('CHECK FILE Per dl Immagine:\nControllo esistenza:\nPath: ' + pathFile);
      this.checkIfFileExists(t, cartelletta, titolone).then(Ritorno2 => {
        t.utility.scriveDebug('Check File Immagine. Ritorno: ' + Ritorno2);
        if (Ritorno2 === 'SI') {
          ComponentFile.percorsoImmagineSD = pathFile;
          Ritorno('OK');
        } else {
          this.checkIfFileExistsForDownload(t).then((Ritorno2) => {
            Ritorno('OK');
          });
        }
      });
    });
  }
  
  downloadBrano(t, pathBrano, cartelletta, titolone) {
    return new Promise((Ritorno) => {
      ComponentFile.pathBrano = pathBrano;
      ComponentFile.cartelletta = cartelletta;
      ComponentFile.titolone = titolone;
      ComponentFile.modalita = 'DOWNLOADBRANO';
  
      const pathFile = ComponentFile.pathSD + cartelletta + '/' + titolone;
      t.utility.scriveDebug('CHECK FILE Per dl brano. Path: ' + pathFile);
      t.utility.scriveDebug('CHECK FILE Per dl brano. pathBrano: ' + pathBrano);
      t.utility.scriveDebug('CHECK FILE Per dl brano. Cartelletta: ' + cartelletta);
      t.utility.scriveDebug('CHECK FILE Per dl brano. Titolone: ' + titolone);
      this.checkIfFileExists(t, cartelletta, titolone).then(Ritorno2 => {
        t.utility.scriveDebug('Check File Brano. Ritorno: ' + Ritorno2);
        if (Ritorno2 === 'SI') {
          ComponentFile.percorsoFileSD = pathFile;
          Ritorno('OK');
        } else {
          this.checkIfFileExistsForDownload(t).then((Ritorno2) => {
            t.utility.scriveDebug('Check File Brano. Aggiorno file brani locali: ' + cartelletta + '/' + titolone);
            const b = (cartelletta + '/' + titolone + '§');
            t.braniSD += b;
            this.file.writeFile(ComponentFile.pathSD + 'LooigiSoft/looWebPlayer/', 'jsonBraniLocali.json', t.braniSD).then((Ritorno3) => {
              Ritorno('OK');
            });
            Ritorno('OK');
          });
        }
      });
    });
  }

  checkIfFileExists(t, cartelletta, titolone) {
    return new Promise(async (Ritorno) => {
      t.utility.scriveDebug('CHECK FILE 1.\n' + cartelletta + '\n' + titolone);
      // ComponentFile.appoggioFile = '';
      let path =  this.sistemaNomeFile(ComponentFile.pathSD + '/' + cartelletta + '/' + titolone);
      t.utility.scriveDebug('CHECK FILE 2.\n' + path);
      const f = path.split('/');
      const filetto = f[f.length - 1];
      path = path.replace(filetto, '');

      t.utility.scriveDebug('CHECK FILE: Controllo esistenza:\nCartella: ' + path + '\nFile: ' + filetto); // + '\nModalità: ' + ComponentFile.modalita);
      await this.file.checkFile(path, filetto).then(_ => 
        {
          // ComponentFile.appoggioFile = this.sistemaNomeFile(path);
          t.utility.scriveDebug('CHECK FILE: Esiste file: ' + filetto);
          // ComponentFile.esisteFile[indice] = 'SI';
          Ritorno('SI');
        }
      ).catch(err =>
        {
          if (err.message.indexOf('NOT_FOUND') === -1) {
            t.utility.scriveDebug('CHECK FILE: NON esiste file: ' + filetto + ' ERROR: ' + JSON.stringify(err));
          }
          // ComponentFile.esisteFile[indice] = 'NO';
          Ritorno('NO');
        }
      );
    });

    /* Files.appoggioFile = '';
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      // path is the full absolute path to the file.
      const path = Files.sistemaNomeFile(Files.pathSD + '/' + cartelletta + '/' + titolone);
      t.utility.scriveDebug('CHECK FILE: Controllo esistenza:\n' + path + '\nModalità: ' + Files.modalita);
      window['resolveLocalFileSystemURL'](
        path, 
        function fileEsistente(fileEntry) {
          Files.appoggioFile = Files.sistemaNomeFile(Files.pathSD + '/' + fileEntry.fullPath);
          t.utility.scriveDebug('CHECK FILE: Esiste file: ' + Files.appoggioFile);
          Files.esisteFile[indice] = 'SI';
        }, 
        function() { 
          t.utility.scriveDebug('CHECK FILE: NON esiste file: ' + Files.appoggioFile);
          Files.esisteFile[indice] = 'NO';
        }
      );
    } */
  }

  checkIfFileExistsForDownload(t) {
    return new Promise((Ritorno) => {
      ComponentFile.interrompiDownload = false;
      ComponentFile.staScaricandoFile = true;
  
      ComponentFile.operazioneSuFile = 'Download in corso';
      t.utility.scriveDebug('Download file:\nCartella: ' + ComponentFile.cartelletta + '\nPath: ' + ComponentFile.pathBrano +
                    '\nTitolo: ' + ComponentFile.titolone + '\nModalità: ' + ComponentFile.modalita);
      switch (ComponentFile.modalita) {
        case 'DOWNLOADBRANO':
          // alert('Download ' + Files.cartelletta + '/' + Files.titolone);
          downloader.abort();
          downloader.init({folder: ComponentFile.cartelletta });
          downloader.get(ComponentFile.pathBrano, null, ComponentFile.titolone);
  
          document.addEventListener('DOWNLOADER_downloadError', function(event) {
            const data = event['data'];
            ComponentFile.operazioneSuFile = 'Errore Download: ' + JSON.stringify(data);
            t.scrollaTesto('txtOperazioneSuFile', ComponentFile.operazioneSuFile, 1);
            // alert('Errore nel download\n' + data);
            ComponentFile.operazioneSuFile = 'Download interrotto';
            ComponentFile.staScaricandoFile = false;
            t.utility.scriveDebug('Download file error: ' + JSON.stringify(event));
            downloader.abort();
            
            Ritorno('ERRORE');
          });
          document.addEventListener('DOWNLOADER_downloadProgress', function(event) {
            const data = event['data'];
            // alert(JSON.stringify(data));
            ComponentFile.operazioneSuFile = 'Download in corso: ' + data[0];
            if (ComponentFile.interrompiDownload === true) {
              ComponentFile.operazioneSuFile = 'Download interrotto';
              ComponentFile.staScaricandoFile = false;
              downloader.abort();
            }
            t.scrollaTesto('txtOperazioneSuFile', ComponentFile.operazioneSuFile, 1);
          });
          document.addEventListener('DOWNLOADER_downloadSuccess', function(event) {
            const data = event['data'];
            // alert(JSON.stringify(data));
            let patthino = JSON.stringify(data[0].nativeURL);
            while (patthino.indexOf('\'') > -1) {
              patthino = patthino.replace('\'', '');
            }
            while (patthino.indexOf('"') > -1) {
              patthino = patthino.replace('"', '');
            }
            // alert('Brano scaricato\n' + JSON.stringify(data));
            ComponentFile.percorsoFileSD = patthino; // this.sistemaNomeFile(ComponentFile.pathSD + patthino);
            if (!ComponentFile.filesInMemoria) { ComponentFile.filesInMemoria = new Array(); }
            ComponentFile.filesInMemoria.push(ComponentFile.percorsoFileSD);
            ComponentFile.operazioneSuFile = 'Download effettuato';
            t.scrollaTesto('txtOperazioneSuFile', ComponentFile.operazioneSuFile, 1);
            t.utility.scriveDebug('Download file completato: ' + ComponentFile.percorsoFileSD);
  
            ComponentFile.operazioneSuFile = '';
            ComponentFile.staScaricandoFile = false;

            downloader.abort();
          
            Ritorno('OK');
          });
          break;
        case 'DOWNLOADIMMAGINE':
          // alert('Download ' + Files.cartelletta + '/' + Files.titolone);
          downloader.abort();
          downloader.init({folder: ComponentFile.cartelletta });
          downloader.get(ComponentFile.pathBrano, null, ComponentFile.titolone);
  
          document.addEventListener('DOWNLOADER_downloadError', function(event) {
            const data = event['data'];
            t.utility.scriveDebug('Download file error: ' + JSON.stringify(data));
            ComponentFile.operazioneSuFile = 'Download interrotto';
            ComponentFile.staScaricandoFile = false;
            downloader.abort();
          
            Ritorno('ERRORE');
          });
          document.addEventListener('DOWNLOADER_downloadProgress', function(event) {
            // const data = event['data'];
            if (ComponentFile.interrompiDownload === true) {
              ComponentFile.operazioneSuFile = 'Download interrotto';
              ComponentFile.staScaricandoFile = false;
              downloader.abort();
            }
          });
          document.addEventListener('DOWNLOADER_downloadSuccess', function(event) {
            const data = event['data'];
            let patthino = JSON.stringify(data[0].fullPath);
            while (patthino.indexOf('\'') > -1) {
              patthino = patthino.replace('\'', '');
            }
            while (patthino.indexOf('"') > -1) {
              patthino = patthino.replace('"', '');
            }
            // alert('Brano scaricato\n' + patthino);
            ComponentFile.percorsoImmagineSD = this.sistemaNomeFile(ComponentFile.pathSD + patthino);
            ComponentFile.staScaricandoFile = false;
            t.utility.scriveDebug('Download file completato: ' + ComponentFile.percorsoImmagineSD);
            downloader.abort();
          
            Ritorno('OK');
          });
          break;
      }
    });

    /* document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      // path is the full absolute path to the file.
      const path = this.sistemaNomeFile(ComponentFile.pathSD + '/' + ComponentFile.cartelletta + '/' + ComponentFile.titolone);
      // alert('Controllo esistenza:\n' + path + '\nModalità: ' + Files.modalita);
      window['resolveLocalFileSystemURL'](
        path, 
        function fileEsistente(fileEntry) {
          ComponentFile.percorsoFileSD = this.sistemaNomeFile(ComponentFile.pathSD + '/' + fileEntry.fullPath);
          // alert('Il File ' + fileEntry.fullPath + ' esiste!');
        }, 
        function() { 
          // alert('Il file non esiste\nModalità: ' + Files.modalita);
          ComponentFile.operazioneSuFile = 'Download in corso';
          switch (ComponentFile.modalita) {
            case 'DOWNLOADBRANO':
              // alert('Download ' + Files.cartelletta + '/' + Files.titolone);
              downloader.abort();
              downloader.init({folder: ComponentFile.cartelletta });
              downloader.get(ComponentFile.pathBrano, null, ComponentFile.titolone);

              document.addEventListener('DOWNLOADER_downloadError', function(event) {
                const data = event['data'];
                ComponentFile.operazioneSuFile = 'Errore Download: ' + JSON.stringify(data[0]);
                // alert('Errore nel download\n' + data);
                ComponentFile.operazioneSuFile = 'Download interrotto';
                ComponentFile.staScaricandoFile = false;
                downloader.abort();
              });
              document.addEventListener('DOWNLOADER_downloadProgress', function(event) {
                const data = event['data'];
                ComponentFile.operazioneSuFile = 'Download in corso: ' + JSON.stringify(data[0]);
                if (ComponentFile.interrompiDownload === true) {
                  ComponentFile.operazioneSuFile = 'Download interrotto';
                  ComponentFile.staScaricandoFile = false;
                  downloader.abort();
                }
              });
              document.addEventListener('DOWNLOADER_downloadSuccess', function(event) {
                const data = event['data'];
                let patthino = JSON.stringify(data[0].fullPath);
                while (patthino.indexOf('\'') > -1) {
                  patthino = patthino.replace('\'', '');
                }
                while (patthino.indexOf('"') > -1) {
                  patthino = patthino.replace('"', '');
                }
                // alert('Brano scaricato\n' + patthino);
                ComponentFile.percorsoFileSD = this.sistemaNomeFile(ComponentFile.pathSD + patthino);
                ComponentFile.filesInMemoria.push(ComponentFile.percorsoFileSD);
                ComponentFile.operazioneSuFile = 'Download effettuato';

                setTimeout(() => {
                  ComponentFile.operazioneSuFile = '';
                  ComponentFile.staScaricandoFile = false;
                }, 1000);
                downloader.abort();
              });
              break;
            case 'DOWNLOADIMMAGINE':
              // alert('Download ' + Files.cartelletta + '/' + Files.titolone);
              downloader.abort();
              downloader.init({folder: ComponentFile.cartelletta });
              downloader.get(ComponentFile.pathBrano, null, ComponentFile.titolone);

              document.addEventListener('DOWNLOADER_downloadError', function(event) {
                const data = event['data'];
                ComponentFile.operazioneSuFile = 'Download interrotto';
                ComponentFile.staScaricandoFile = false;
                downloader.abort();
              });
              document.addEventListener('DOWNLOADER_downloadProgress', function(event) {
                const data = event['data'];
                if (ComponentFile.interrompiDownload === true) {
                  ComponentFile.operazioneSuFile = 'Download interrotto';
                  ComponentFile.staScaricandoFile = false;
                  downloader.abort();
                }
              });
              document.addEventListener('DOWNLOADER_downloadSuccess', function(event) {
                const data = event['data'];
                let patthino = JSON.stringify(data[0].fullPath);
                while (patthino.indexOf('\'') > -1) {
                  patthino = patthino.replace('\'', '');
                }
                while (patthino.indexOf('"') > -1) {
                  patthino = patthino.replace('"', '');
                }
                // alert('Brano scaricato\n' + patthino);
                ComponentFile.percorsoImmagineSD = this.sistemaNomeFile(ComponentFile.pathSD + patthino);
                ComponentFile.staScaricandoFile = false;
                downloader.abort();
              });
              break;
            }
        }
      );
    } */
  }

  sistemaNomeFile(pathP) {
    let path = pathP;

    path = path.replace('file:///', '');
    while (path.indexOf('//') > - 1) {
      path = path.replace('//', '/');
    }
    path = 'file:///' + path;

    return path;
  }

  createDir(t, indice, new_directoryP, salvaFile) {
    return new Promise((Ritorno) => {
      let new_directory = '';
      const n = new_directoryP.split('/');
      for (let i = 0; i < n.length - 1; i++) {
        new_directory += n[i] + '/';
      }
      if (new_directory.length > 0) {
        new_directory = new_directory.substring(0, new_directory.length - 1);
      }
      if (new_directory === '') {
        return;
      }
  
      new_directory = new_directory.replace(ComponentFile.pathSD, '') + '/';
      // t.utility.scriveDebug('CREATE DIR: ' + new_directory);
  
      const dirs = new_directory.split('/'); // .reverse();
      let p = '';
      let o = ComponentFile.pathSD;
      dirs.forEach(async element => {
        if (element !== '') {
          p += element + '/'
          // t.utility.scriveDebug('CREATE DIR:\nOrigine: ' + o + '\nPath: ' + p);
          await this.file.createDir(o, p, false).then(_ => 
            {
              // t.utility.scriveDebug('CREATA DIR: ' + p);
            }
          ).catch(err =>
            {
              if (err.message.indexOf('EXISTS') === -1) {
                t.utility.scriveDebug('CREATA DIR: ' + p + '. Errore: ' + JSON.stringify(err));
              }
            }
          );
          o += p;
        }
      });

      if (salvaFile) {
        this.writeFile2(t, indice).then(_ => {
          
        });
      }

      Ritorno('OK');
    });

    /* document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      t.utility.scriveDebug('CREATE DIR: device is ready');
      window['requestFileSystem'] = window['requestFileSystem'] || window['webkitRequestFileSystem'];
      window['requestFileSystem'](1, 0, gotFS, fail);
    }
    function fail() {
      t.utility.scriveDebug('CREATE DIR: failed to get filesystem');
    }
  
    function gotFS(fileSystem) {
      window['FS'] = fileSystem;
      
      var printDirPath = function(entry){
        t.utility.scriveDebug('CREATE DIR: Dir path - ' + entry.fullPath);
      } 
      
      createDirectory(new_directory, printDirPath);
    }

    function createDirectory(path, success) {
      var dirs = path.split('/'); // .reverse();
      let indice2 = 0;
      var root = window['FS'].root;
      
      var createDir = function() {
        // pathDaScrivere += (dirs[indice] + '/');
        // indice++;
        // pathDaScrivere = pathDaScrivere.substring(0, pathDaScrivere.length - 1);
        let dir = dirs[indice2];
        indice2++;
        t.utility.scriveDebug('CREATE DIR: create dir ' + dir + '. Indice: ' + indice2);
        if (dir === undefined) {
          t.utility.scriveDebug('CREATE DIR: all dir created');
          success(root);

          if (salvaFile) {
            Files.writeFile2(t, indice);
          }
        } else {
          root.getDirectory(dir, {
            create : true,
            exclusive : false
          }, successCB, failCB);
        }
      };
      
      var successCB = function(entry){
        t.utility.scriveDebug('CREATE DIR: dir created ' + entry.fullPath);
        root = entry;
        if(dirs.length > indice2 - 1){
          createDir();
        }else{
          t.utility.scriveDebug('CREATE DIR: all dir created');
          success(entry);

          if (salvaFile) {
            Files.writeFile2(t, indice);
          }
        }
      };
      
      var failCB = function(){
        t.utility.scriveDebug('CREATE DIR: failed to create dir ' + dirs[indice2]);
      };
      
      createDir();
    }  */
  }

  writeFile(t, indice, path, filename, blob) {
    return new Promise(async (Ritorno) => {
      let rit = '';
      ComponentFile.pathJson[indice] = path;
      ComponentFile.fileNameJson[indice] = filename;
      ComponentFile.blobJson[indice] = blob;
  
      const path2 = this.sistemaNomeFile(ComponentFile.pathSD + ComponentFile.pathJson[indice] + '/' + ComponentFile.fileNameJson[indice]);
      t.utility.scriveDebug('WRITE FILE: Path: ' + path2);
      await this.createDir(t, indice, path2, true).then((Ritorno: string) => {
        rit = Ritorno;
      });

      Ritorno(rit);
    });
  }

  writeFile2(t, indice) {
    return new Promise(async (Ritorno) => {
      let path = this.sistemaNomeFile(ComponentFile.pathSD + ComponentFile.pathJson[indice] + '/' + ComponentFile.fileNameJson[indice]);
      t.utility.scriveDebug('CREATE FILE ARR:\nPath: ' + path);

      const f = path.split('/');
      const filetto = f[f.length - 1];
      path = path.replace(filetto, '');

      t.utility.scriveDebug('CREATE FILE:\nPath: ' + path + '\nFile: ' + filetto);
  
      await this.file.writeFile(path, filetto, ComponentFile.blobJson[indice]).then(_ => 
        {
          t.utility.scriveDebug('CREATE FILE Ok');
          Ritorno('OK');
        }
      ).catch(err =>
        {
          t.utility.scriveDebug('CREATE FILE Error: ' + JSON.stringify(err));
          Ritorno('ERRORE: ' + err);
        }
      );
    })

    /* document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      const path = Files.sistemaNomeFile(Files.pathSD + Files.pathJson[indice] + '/' + Files.fileNameJson[indice]);

      let path2 = '';
      const n = path.split('/');
      for (let i = 0; i < n.length - 1; i++) {
        path2 += n[i] + '/';
      }
      let nome = path.replace(path2, '');
      if (path2.length > 0) {
        path2 = path2.substring(0, path2.length - 1);
      }
      
      t.utility.scriveDebug('WRITE FILE: Scrivo file nella cartella ' + path2 + ' con nome ' + nome + '. Lunghezza: ' + Files.blobJson[indice].length);
      window['resolveLocalFileSystemURL'](
        path2, 
        function success(dataDirEntry) {
          dataDirEntry['getFile'](nome, { create: true, exclusive: false }, function (newFileEntry) {
          newFileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function () {
              t.utility.scriveDebug('WRITE FILE: Scritto file ' + path);
              // alert('File JSON creato');                                   
            };

            fileWriter.onerror = function (e) {
              t.utility.scriveDebug('WRITE FILE: Errore nella scrittura del JSON: ' + JSON.stringify(e));
            };

            const blob = new Blob([Files.blobJson[indice]], { type: newFileEntry.type });

            fileWriter.write(blob);                               
          });
        }, function(e) { 
          t.utility.scriveDebug('WRITE FILE: Errore nella creazione del file:' + e.code + '. ' + path); 
        });
      }, function error(e) { 
        t.utility.scriveDebug('WRITE FILE: Errore nello risolvere la cartella: ' + e.code + ' -> ' + path); 
      });
    } */
  }

  readFile(t, nomeFile, indice) {
    return new Promise(async (Ritorno) => {
      let path = nomeFile;
      const f = nomeFile.split('/');
      const filetto = f[f.length - 1];
      path = path.replace(filetto, '');
  
      t.utility.scriveDebug('CREATE FILE: Path: ' + path + ' File: ' + filetto);
      await this.file.readAsText(path, filetto).then(fileStr => 
        {
          t.utility.scriveDebug('CREATE FILE Ok');
          // ComponentFile.fileJSON[indice] = fileStr;
          Ritorno(fileStr);
        }
      ).catch(err =>
        {
          t.utility.scriveDebug('CREATE FILE Error: ' + JSON.stringify(err));
          // ComponentFile.fileJSON[indice] = 'Error: ' + err;
          Ritorno('ERROR: ' + JSON.stringify(err));
        }
      );
    });
    // Files.fileNameJson[indice] = nomeFile;
    /* const path = Files.sistemaNomeFile(nomeFile);

    let path2 = '';
    const n = path.split('/');
    for (let i = 0; i < n.length - 1; i++) {
      path2 += n[i] + '/';
    }
    let nome = path.replace(path2, '');
    if (path2.length > 0) {
      path2 = path2.substring(0, path2.length - 1);
    } */
    
    // alert('Leggo file ' + nomeFile);
    /* t.utility.scriveDebug('READ FILE: Leggo file 1: ' + nomeFile + ' Indice: ' + indice);
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      window['resolveLocalFileSystemURL'](
        Files.fileNameJson[indice], 
        function success(fileEntry) {
          fileEntry['file'](function (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
              const fileData = this.result;
              Files.fileJSON[indice] = <string>fileData;
              t.utility.scriveDebug('READ FILE: Letto file. Lunghezza ' + Files.fileJSON[indice].length);
          };
          reader.readAsText(file);
        }, function(e) { 
          t.utility.scriveDebug('READ FILE: Errore nell\'apertura del file:' + e.code + '.' + e.message + ' -> ' + nomeFile); 
        });
      }, function error(e) { 
        t.utility.scriveDebug('READ FILE: Errore nella risoluzione della cartella: ' + e.code + ' -> ' + nomeFile);  
      });
    } */
  }

  static eliminaFiles(t, indice) {
    return;
    
    if (ComponentFile.giaEliminati === true) {
      return;
    }
    ComponentFile.giaEliminati = true;

    // alert('Files totali sulla sd: ' + Files.filesInMemoria.length);
    // alert('Files massimi: ' + t.numeroLimiteBrani);

    if (t.limitaBrani === true) {
      const perc = t.numeroLimiteBrani * 75 / 100;
      if (ComponentFile.filesInMemoria.length > perc) {
        const diff = (ComponentFile.filesInMemoria.length - perc) + 1;

        // alert('Differenza: ' + diff);

        let quanti = 0;
        let indice = 0;
        let fatti = '';

        while (quanti <= diff) {
          const x = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

          // alert('Random: ' + x);

          for (let i = 0; i <= indice; i++) {
            indice++;
            if (indice > ComponentFile.filesInMemoria.length) {
              indice = 0;
            }            
          }

          let q = 0;

          while (fatti.indexOf(';' + indice + ';') > -1 && q < ComponentFile.filesInMemoria.length) {
            q++;
            indice++;
            if (indice > ComponentFile.filesInMemoria.length) {
              indice = 0;
            }            
          }

          // alert('Indice da eliminare: ' + indice + ' ' + quanti + '/' + diff);

          if (q < ComponentFile.filesInMemoria.length) {
            const path = t.file.sistemaNomeFile(ComponentFile.pathSD + ComponentFile.filesInMemoria[indice]);
            // alert('Elimino: ' + path);
            // // this.cancellaFileFisico(indice, path);
            fatti += ';' + indice + ';'
          } else {
            quanti = diff;
          }

          quanti++;
        }
        // alert('Fine');
        if (t.deviceGirante === 'Android') {
          alert('Elimina files 2. Eliminati: ' + quanti);
        }    
      }
    }
  }

  cancellaFileFisico(t, indice, nomeFile) {
    return new Promise(async (Ritorno) => {
      let path = nomeFile;
      const f = nomeFile.split('/');
      const filetto = f[f.length - 1];
      path = path.replace(filetto, '');
  
      t.utility.scriveDebug('DELETE FILE: Path: ' + path + ' File: ' + filetto);
      await this.file.removeFile(path, filetto).then(fileStr => 
        {
          t.utility.scriveDebug('DELETE FILE Ok');
          Ritorno('OK');
        }
      ).catch(err =>
        {
          t.utility.scriveDebug('DELETE FILE Error: ' + JSON.stringify(err));
          Ritorno('ERRORE: ' + JSON.stringify(err));
        }
      );
    });

    /* Files.fileNameJsonDaEliminare = nomeFile;
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      window['resolveLocalFileSystemURL'](
        Files.fileNameJsonDaEliminare[indice], 
        function success(fileEntry) {
          fileEntry.remove(function(){
              // The file has been removed successfully
          },function(error){
              // Error deleting the file
          });
        });
    }; */
  }

  prendeTuttiIFilesInLocale(t, indice) {
    return new Promise(async (Ritorno) => {
      let path = ComponentFile.pathSD; // + '/LooigiSoft/looWebPlayer';
      const f = path.split('/');
      const filetto = f[f.length - 1];
      path = path.replace(filetto, '');
      t.letturaSD = true;
      // ComponentFile.profondita = 0;

      t.utility.scriveDebug('Inizio lettura SD:\nPath: ' + path + '\nCartella: ' + filetto);
      await this.prendeFilesInDir(t, path, filetto, indice);
        
      // ComponentFile.staLeggendoFiles[indice] = false;
      t.utility.scriveDebug('Presi tutti i files in locale');
      t.utility.scriveDebug('Righe: ' + ComponentFile.filesInMemoria.length);
      t.utility.scriveDebug('Riga 1: ' + ComponentFile.filesInMemoria[0]);
      // alert('Elimina i files in più');

      // ComponentFile.eliminaFiles(t, indice);
      t.letturaSD = false;

      // ComponentFile.profondita--;
      // if (ComponentFile.profondita <= 0) {
        /* setTimeout(() => {
          ComponentFile.staLeggendoFiles[indice] = false;
          t.utility.scriveDebug('Presi tutti i files in locale');
          t.utility.scriveDebug('Righe: ' + ComponentFile.filesInMemoria.length);
          t.utility.scriveDebug('Riga 1: ' + ComponentFile.filesInMemoria[0]);
          // alert('Elimina i files in più');
  
          // ComponentFile.eliminaFiles(t, indice);
          t.caricamentoInCorso = false;
        }, 3000); */

        Ritorno('OK');
     });
    // }
  }

  async prendeFilesInDir(t, path, filetto, indice) {
    return new Promise(async (Ritorno) => {
      path = this.sistemaNomeFile(path);
      // t.utility.scriveDebug('READ DIR: Path: ' + path + ' File: ' + filetto);
      // t.utility.scriveDebug('READ DIR: Profondità: ' + this.profondita);
      await this.file.listDir(path, filetto).then(async result => {
        for(let file of result) {
          if(file.isDirectory == true && file.name !='.' && file.name !='..') {
            t.cartellaEsaminata = file.name;
            await this.prendeFilesInDir(t, path + filetto + '/', file.name, indice).then((Ritorno) => {
            });
          } else if(file.isFile == true) {          
            let name = file.name;
            if (name.toUpperCase().indexOf('MP3') > -1 || name.toUpperCase().indexOf('WMA') > -1) {
              let tutto = path + filetto + '/' + name;
              // tutto = tutto.replace('file:///', '');
              tutto = tutto.replace(ComponentFile.pathSD, '');
              ComponentFile.filesInMemoria.push(tutto);
            }
          }
        }
      }).catch(err => {
        if (err.indexOf('NOT_FOUND') === -1) {
          t.utility.scriveDebug('READ DIR Error ' + JSON.stringify(err));
        }
      });

      Ritorno('OK');
    });
  }

    // alert('Prende tutti i files');
    /* t.utility.scriveDebug('Prende tutti i files in locale');
    const addFileEntry = function(entry) {
      var dirReader = entry.createReader();
      dirReader.readEntries(
        function (entries) {
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].isDirectory === true) {
              // Cartella
              Files.profondita++;

              addFileEntry(entries[i]);
            } else {
              // File
              if (entries[i].fullPath.toUpperCase().indexOf('.MP3') > -1 || 
                entries[i].fullPath.toUpperCase().indexOf('.WMA') > -1) {
                Files.filesInMemoria.push(entries[i].fullPath);
                // console.log(entries[i].fullPath);
              }
            }
          }
          Files.profondita--;
          if (Files.profondita <= 0) {
            setTimeout(() => {
              Files.staLeggendoFiles[indice] = false;
              t.utility.scriveDebug('Presi tutti i files in locale');
              t.utility.scriveDebug('Righe: ' + Files.filesInMemoria.length);
              t.utility.scriveDebug('Riga 1: ' + Files.filesInMemoria[0]);
              // alert('Elimina i files in più');

              Files.eliminaFiles(t, indice);
            }, 100);
            // alert('Files su SD: ' + Files.filesInMemoria.length);
          }
          // console.log(Files.filesInMemoria);
        },
        function (error) {
          console.error("readEntries error: " + error.code);
        }
      );
    };

    const addError = function (error) {
      console.error("getDirectory error: " + error.code);
    };

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      // const path = 'file:///storage/emulated/0/LooigiSoft/looWebPlayer/Brani';
      const path = Files.pathSD;
      Files.profondita = 0;
      window['resolveLocalFileSystemURL'](path, addFileEntry, addError);
    }
  }  */
}
