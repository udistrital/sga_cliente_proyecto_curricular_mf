import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";

@Injectable({
    providedIn: 'root',
})

export class DependenciasService {

    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('DEPENDENCIAS_SERVICE');
    }

    get(endpoint: string) {
        this.requestManager.setPath('DEPENDENCIAS_SERVICE');
        return this.requestManager.get_soap(endpoint);
    }
}