import { OnDestroy, OnInit } from "@angular/core";
import { timer } from 'rxjs/observable/timer'

declare var cordova:any;
export class ClasseTimer implements OnInit, OnDestroy { 
    formPrincipale;
    timerSub;
    contatore = 0;
    fermaTimer = false;
    backgroundMode;

    constructor(
        t
        )
    {
        this.formPrincipale = t;
        // this.backgroundMode = bm;
        this.formPrincipale.utility.scriveDebug(this.formPrincipale, 'Instanzio classe timer');
    }

    parto() {
        // this.backgroundMode.enable();
        if (this.formPrincipale.deviceGirante === 'Android') {
            cordova.plugins.backgroundMode.enable();
        }

        this.formPrincipale.utility.scriveDebug(this.formPrincipale, 'Faccio partire timer');
        this.fermaTimer = false;
        this.contatore = 0;

        this.initiateTimer();
    }

    ngOnInit(): void {
    }

    stoppaTimer() {
        this.fermaTimer = true;

        if (this.formPrincipale.deviceGirante === 'Android') {
            cordova.plugins.backgroundMode.disable();
        }
        // this.backgroundMode.disable();
    }

    ngOnDestroy(): void {
        // if (this.formPrincipale.deviceGirante !== 'Android') {
            this.formPrincipale.utility.scriveDebug(this.formPrincipale, 'Distruggo classe timer');
            if (this.timerSub) {
                this.timerSub.unsubscribe();
                this.timerSub = undefined;
            }
        // } else {

        // }
    }

    initiateTimer() {
        // if (this.formPrincipale.deviceGirante !== 'Android') {
            if (this.timerSub) {
                this.timerSub.unsubscribe();
            }
        
            this.timerSub = timer(0, 1000).subscribe(x =>{
                this.contatore++;
                // console.log(this.contatore);
                
                if (this.fermaTimer === true) {
                    this.formPrincipale.utility.scriveDebug(this.formPrincipale, 'Stoppo timer');
                    this.timerSub.unsubscribe();
                    this.timerSub = undefined;
                    return;
                }

                this.formPrincipale.funzioneTick();
            });     
        /* } else {
            this.timerSub = new window['nativeTimer'];
            this.timerSub.onTick = function(tick) {
                this.formPrincipale.funzioneTick();
            };
            this.timerSub.onError = function(errorMessage) {
            // invoked after error occurs
            };
            this.timerSub.onStop = function(hasError) {
            // invoked after stop
            };
            this.timerSub.start(
                1,
                1000,
                function() {
                  // invoked after successful start
                },
                function(errorMessage) {
                  // invoked after unsuccessful start
            });
        } */
    }    

}