import { Component } from '@angular/core';
import {
  InputComponent,
  SpinnerService,
  ToastService,
} from '../../shared/shared';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../shared/services/auth/auth.service';
import { IUserLogin } from '../../interfaces/IUser';
import { TOAST } from '../../shared/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public email!: FormControl;
  public password!: FormControl;
  public loginForm!: FormGroup;
  isLogin = true;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly spinnerService: SpinnerService,
    private router: Router
  ) {
    this.initForm();
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.loginForm.reset();
  }

  public async doLogin() {
    try {
      this.spinnerService.show();
      const credentials: IUserLogin = this.loginForm.value;
      const response = await this.authService.login(credentials);
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.INFO,
        message: 'Login con exito',
        title: 'Exito',
      });

      this.router.navigate(['/index']);
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        message: 'Correo y contraseña no validos',
        title: 'Login fallido',
      });
    }
  }

  private initForm() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }
}
