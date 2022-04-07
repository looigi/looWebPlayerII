
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/catch';

import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { UtilityComponent } from '../varie/utility.component';
@Injectable()
export class HttpService {

  headers;

  constructor(private http: Http) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      return observableThrowError(res);
    };
  }

  get(t, url, params?) {
    if (t.deviceGirante === 'Android') {
      const postHeaders = new Headers(this.headers);
      postHeaders.append('Content-Type', 'application/text');
      postHeaders.append("Cache-Control", "no-cache");
      postHeaders.append("Access-Control-Allow-Origin", "*");
      postHeaders.append("Access-Control-Allow-Credentials", "true");
      postHeaders.append("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
      postHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
      // console.log('HEADERS', this.headers);
      /* return this.http.get(url, {
        search: params,
        headers: postHeaders
      }).catch(this.catchAuthError(this)); */

      return this.http.get(
        url, {
          search: params,
          headers: postHeaders
        }      
      )
      .pipe(
        timeout(UtilityComponent.TimeOutConnessione),
        catchError(e => {
          // do something on a timeout
          return of(null);
          // return e;
        })
      );
    } else {
      /* return this.http.get(url, {
        search: params,
        headers: this.headers
      }).catch(this.catchAuthError(this)); */

      return this.http.get(
        url, {
          search: params,
          headers: this.headers
        }
      )
      .pipe(
        timeout(UtilityComponent.TimeOutConnessione),
        catchError(e => {
          // do something on a timeout
          return of(null);
          // return e;
        })
      );
    }
  }

  post(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/text');
    
    postHeaders.append("Cache-Control", "no-cache");
    postHeaders.append("Access-Control-Allow-Origin", "*");
    postHeaders.append("Access-Control-Allow-Credentials", "true");
    postHeaders.append("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    postHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  
    const body = JSON.stringify(data);
    return this.http.post(url, body, {headers: postHeaders})
      .catch(this.catchAuthError(this));
  }

  post2(url, data, postHeaders) {
    const body = JSON.stringify(data);
    return this.http.post(url, body, {headers: postHeaders})
      .catch(this.catchAuthError(this));
  }

  put(url, data) {
    const putHeaders = new Headers(this.headers);
    putHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.put(url, body, {headers: putHeaders})
      .catch(this.catchAuthError(this));
  }

  delete(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.delete(url, {headers: postHeaders, body: body})
      .catch(this.catchAuthError(this));
  }

  async downloadFile(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // console.log(r);
    return r;
  }
}