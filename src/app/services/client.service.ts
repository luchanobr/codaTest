import { Injectable } from '@angular/core';
import { Client } from '../entities/client';
import { MiaBaseCrudHttpService, MiaPagination } from '@agencycoda/mia-core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends MiaBaseCrudHttpService<Client> {
  constructor(protected http: HttpClient) {
    super(http);
    this.basePathUrl = environment.baseUrl + 'client';
  }
}
