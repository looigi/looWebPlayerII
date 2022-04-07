import { isNgTemplate } from "@angular/compiler";
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { fade } from "../animations";
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-upload',
    templateUrl: './uploadbrani.component.html',
    styleUrls: ['./uploadbrani.component.css'],
    animations: fade
})

export class UploadBraniComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() mascheraVisibile;
    @Input() urlPerUpload;
    @Input() t;

    @Output() refreshBrani: EventEmitter<string> = new EventEmitter();
    @Output() chiusuraMaschera: EventEmitter<string> = new EventEmitter();

    attendiUpload = false;
    fileCount: number;
    qualeFile: number;
    files: FileList;
    effettuaRefreshBrani = false;
    fileLogName = '';
    pathFileLog = '';
    visuaLog = false;
    contenutoLog = '';

    constructor(
        private datePipe: DatePipe,
        private http: Http,
    ) {

    }

    ngOnInit(): void {
        this.fileCount = 0;
        this.files = undefined;
    }

    ngAfterViewInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        
    }

    fChiusuraMaschera() {
        this.chiusuraMaschera.emit(new Date().toString());
    }

    appoggiaFiles(files: FileList) {
        this.fileCount = files.length;
        this.files = files;
    }

    handleFileInput() {
        if (this.fileCount > 0) {
            const d1 = this.datePipe.transform(new Date(), 'dd-MM-yyyy_HHmmss', 'UTC');
            
            this.fileLogName = 'Log_' + d1;
            this.attendiUpload = true;
            this.qualeFile = 0;
            this.uploadFile();
        } else {
            this.attendiUpload = false;
            alert('Selezionare almeno un file');
        }
    }

    uploadFile() {
        const formData = new FormData();
        let fileName = '';
        let log = 'SI';

        // for (let i = 0; i < fileCount; i++) {
        formData.append('accept', this.files.item(this.qualeFile), this.files.item(this.qualeFile).name);

        fileName = this.files.item(this.qualeFile).name + ';';
        // console.log(fileName);
        // }

        formData.append('filelog', this.fileLogName);
        formData.append('nomefile', fileName);
        formData.append('log', log);

        const headers = new Headers();
        headers.append('Accept', 'application/json');

        const options = new RequestOptions({ headers: headers });

        console.log('Indirizzo upload', this.urlPerUpload + '/Default.aspx');

        this.http.post(this.urlPerUpload + '/Default.aspx', formData, options)
        .subscribe(
            data => {
                if (this.qualeFile < this.fileCount - 1) {
                    this.qualeFile++;
                    setTimeout(() => {
                        this.uploadFile();
                    }, 100);
                    return;
                } else {
                    this.files = undefined;
                    this.fileCount = 0;
                    this.attendiUpload = false;
                    if (this.effettuaRefreshBrani === true) {
                        this.refreshBrani.emit(new Date().toString());
                    }
                    this.pathFileLog = this.urlPerUpload + '/Logs/' + this.fileLogName + '.txt';
                    this.visuaLog = true;

                    this.http.get(this.pathFileLog).subscribe(content => this.contenutoLog = content.text())
                }
            },
            error => {
                this.attendiUpload = false;
                // t.scriveDebug('Errore nell\'invio', false);
                console.log(error);
            }
        );
    }

    cambioRefreshBrani(e) {
        setTimeout(() => {
            // console.log(e.srcElement.checked);
            this.effettuaRefreshBrani = e.srcElement.checked;
        }, 10);
    }

    chiudeLog() {
        console.log('Chiudo schermata log');
        this.visuaLog = false;
    }
}