import { ToastService } from './../../services/toast.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/interfaces/user';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { BuscaCEPService } from 'src/app/services/busca-cep.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userVetor: User[] = [];
  segmentChange: String = 'visualizar';
  actionSheetCtrl: any;
  cep: string = '';
  alertController: any;
  user = {} as User;

  constructor(
    private fireStore: AngularFirestore,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private toast: ToastService, 
    private buscaCEP: BuscaCEPService
  ) {
    this.getUserData();

    let userJson = localStorage.getItem('userDb')
  }

  private async getUserData(): Promise<void> {
    //primeira maneira de chamar todos os documentos de uma coleção
    const collectionRef = this.fireStore.collection('users');

    let userBanco = await collectionRef.get().toPromise();

    let users = userBanco?.docs.map((doc) => {
      return doc.data();
    });

    console.log(users);

    //segunda maneira de chamar todos os documentos de uma coleção
    collectionRef.valueChanges().subscribe((data) => {
      this.userVetor = data as User[];
      console.log(this.userVetor);
    });
  }

  updateLocalStorage(){
    localStorage.setItem('userDb', JSON.stringify(this.userVetor));
  }

  async add(){
    
    const alert = await this.alertCtrl.create({
      header: 'Digite as informações do novo usuário',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome'
        },
        {
          name: 'cpf',
          type: 'text',
          placeholder: 'CPF'
        },
        {
          name: 'cep',
          type: 'text',
          placeholder: 'CEP'
        },
        {
          name: 'endereco',
          type: 'text',
          placeholder: 'Endereço'
        },
        {
          name: 'cidade',
          type: 'text',
          placeholder: 'Cidade'
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'senha',
          type: 'password',
          placeholder: 'Senha'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: data => {
            this.user.nome = data.nome;
            this.user.cpf = data.cpf;
            this.user.cep = data.cep;
            this.user.endereco = data.endereco;
            this.user.cidade = data.cidade;
            this.user.email = data.email;
            this.firebaseService.signUp(this.user, data.senha)
          }
        }
      ]
    });

    await alert.present();
    
  }

  async edit(user: any){
    
    const alert = await this.alertCtrl.create({
      header: 'Digite as informações do novo usuário',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          value: user.nome
        },
        {
          name: 'cpf',
          type: 'text',
          value: user.cpf
        },
        {
          name: 'cep',
          type: 'text',
          value: user.cep
        },
        {
          name: 'endereco',
          type: 'text',
          value: user.endereco
        },
        {
          name: 'cidade',
          type: 'text',
          value: user.cidade
        },
        {
          name: 'email',
          type: 'email',
          value: user.email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: data => {
            this.fireStore.collection('users').doc(user.uid).update({
              nome: data.nome,
              cpf: data.cpf,
              cep: data.cep,
              encodereco: data.endereco,
              cidade: data.cidade,
              email: data.email
            });
          }
        }
      ]
    });

    await alert.present();
    
  }

  async showInfo(user: any){
    if (user.info == null || user.info == false){
      user.info = true;
    }
    else{
      user.info = false;
    }
  }

  async delete(user: any){

    const alert = await this.alertCtrl.create({
      header: 'Deseja realmente excluir essa tarefa?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Confirmar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.userVetor = this.userVetor.filter(userArray=> user != userArray);
            this.fireStore.collection('users').doc(user.uid).delete();
            this.updateLocalStorage();
          }
        },
        {
          text: 'Não',
          cssClass: 'alert-button-cancel',
        },
      ],
    });

    await alert.present();
  }
  
  async verificaCEP(cep: string){
    console.log(cep);

    const endereco = await this.buscaCEP.consultaCEP(cep);

    const alert = await this.alertCtrl.create({
      header: 'Informações do usuário',
      cssClass: 'custom-alert',
      message: ' <b>CEP:</b>' + (await this.buscaCEP.consultaCEP(cep)).cep +
               '<br> <b>Bairro:</b>' + (await this.buscaCEP.consultaCEP(cep)).bairro + 
               '<br> <b>Logradouro:</b> ' + (await this.buscaCEP.consultaCEP(cep)).logradouro + 
               '<br> <b>Cidade:</b> ' + (await this.buscaCEP.consultaCEP(cep)).localidade + 
               '<br> <b>UF:</b> ' + (await this.buscaCEP.consultaCEP(cep)).uf,
      buttons: [
        {
          text: 'OK',
        }
      ],
    });

    await alert.present();

    console.log(endereco);
  }

}

