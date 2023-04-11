import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavegacaoService } from 'src/app/services/navegacao.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	email: any;
	senha: any;

	constructor(
		private alertController: AlertController,
		private toastService: ToastService,
		private afAuth: AngularFireAuth,
		private fireService: FirebaseService,
		private loadingCtrl: LoadingController,
		private navService: NavegacaoService,
	) {}

	ngOnInit() {}

	async realizarLogin() {
		this.fireService.loginWithEmail(this.email, this.senha);
	}

	async redefinir() {
		const alert = await this.alertController.create({
			header: 'Confirmar redefinição de senha',
			message: 'Tem certeza que deseja redefinir a senha?',
			inputs: [
				{
					name: 'emailr',
					type: 'text',
					placeholder: 'Digite seu Email',
				},
			],
			buttons: [
				{
					text: 'Cancelar',
					role: 'Cancelar',
					handler: blah => {
						console.log('Confirm Cancel: blah');
					},
				},
				{
					text: 'Confirmar!',
					handler: alertData => {
						this.recuperarSenha(alertData.emailr)
							.then(() => {
								this.toastService.showToast(
									'Um email de recuperação foi enviado para a caixa de entrada do email ' +
										alertData.emailr,
									3000
								);
							})
							.catch(e => {
								this.toastService.showToast(e.message, 3000);
							});
					},
				},
			],
		});

		await alert.present();
	}

	recuperarSenha(email: any) {
		return this.afAuth.sendPasswordResetEmail(email);
	}

	navegarPara(nomeDaRota: string) {
		this.navService.navegarPara(nomeDaRota);
	}

	irParaCadastro(){
		this.navService.navegarPara('cadastro')
	}

}
