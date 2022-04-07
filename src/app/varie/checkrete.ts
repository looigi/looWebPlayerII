import { Injectable, OnChanges, OnInit } from "@angular/core";
import { ApiService } from "../services/api2.service";
import { UtilityComponent } from "./utility.component";

@Injectable()
export class CheckReteComponent implements OnInit, OnChanges {
  frmPrincipale;
  staLeggendo;

  constructor(
      public utility: UtilityComponent,
      private apiService: ApiService,
  ) {}

  ngOnInit() {
      
  }

  ngOnChanges() {

  }

  settaFramePrincipale(t) {
    this.frmPrincipale = t;
  }

  AttivaControllo() {
    if (this.frmPrincipale.moadalitaLight) {
      return;
    }
    
    this.checkRete();
    const tt = setInterval(() => {
      this.checkRete();
    }, 30000);
  }

  checkRete() {
    this.staLeggendo = true;
    const t = setInterval(() => {
      if (this.staLeggendo) {
        this.utility.scriveDebug(this.frmPrincipale, 'Lettura Rete. TimeOut');
        this.frmPrincipale.ritornoGet.unsubscribe();  
        this.staLeggendo = false;
        this.frmPrincipale.isConnected = false;
        this.apiService.impostaConnesso(false);
      }
    }, UtilityComponent.TimeOutConnessione);
    this.frmPrincipale.ritornoGet = this.apiService.checkRete(this, this.frmPrincipale.idUtenza)
    .map(response => this.apiService.controllaRitorno(response))
      .subscribe(
        data => {
          // this.utility.scriveDebug(this.frmPrincipale, 'Lettura Rete');
          this.staLeggendo = false;
          clearInterval(t);
          if (data) {
            const data2 = this.apiService.prendeSoloDatiValidi(data);
            // this.utility.scriveDebug(this.frmPrincipale, 'Lettura Rete. Ritorno: ' + data2);
            this.frmPrincipale.isConnected = true;
            this.apiService.impostaConnesso(true);
          } else {
            this.utility.scriveDebug(this.frmPrincipale, 'Lettura Rete. Nessun ritorno');
            this.frmPrincipale.isConnected = false;
            this.apiService.impostaConnesso(false);
          }
    });
  }
}