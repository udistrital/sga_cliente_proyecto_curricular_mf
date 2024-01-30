import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestManager } from '../managers/requestManager';

const httpOptions = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
    }),
}

@Injectable({
  providedIn: 'root',
})

export class OikosService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('OIKOS_SERVICE');
  }
  get(endpoint: any) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.get(endpoint);
  }
  post(endpoint: any, element: any) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint: any, element: any) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.put(endpoint, element);
  }
  delete(endpoint: any, element: { Id: any; }) {
    this.requestManager.setPath('OIKOS_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}

