import { Injectable } from '@angular/core';

import {
  NgxViacepService,
  Endereco,
  CEPError,
  CEPErrorCode,
} from '@brunoc/ngx-viacep';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaCEPService {
  
  enderecoVazio = {
    cep: '',
    complemento: '',
    gia: '',
    ibge: '',
    localidade: '',
    logradouro: '',
    uf: '',
    unidade: '',
    bairro: '',
  };
  
  constructor(
    private viacep: NgxViacepService
  ) { }


  async consultaCEP(cep: string): Promise<Endereco> {
    try {
      const endereco = await firstValueFrom(this.viacep.buscarPorCep(cep));
      return endereco;
    } catch (error) {
      console.log(error);
      this.enderecoVazio.gia = String(error);
      return this.enderecoVazio;
    }
  }
  
}
