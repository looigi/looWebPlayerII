import { Injectable } from '@angular/core';
import { UtilityComponent } from '../varie/utility.component';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords;
  formPrincipale;

  constructor() { }

  init(t) {
    this.formPrincipale = t;
    this.recognition.interimResults = true;
    this.recognition.lang = 'it';
    console.log("Speech recognition inited")

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
  }

  wordConcat() {
    this.text = this.tempWords;
    this.formPrincipale.comandoVocale = this.tempWords;
    setTimeout(() => {
      this.formPrincipale.comandoVocale = '';
    }, 3000);

    this.formPrincipale.utility.parsaTesto(this.formPrincipale, this.tempWords);
    setTimeout(() => {
      this.tempWords = '';
    }, 100);
  }
}