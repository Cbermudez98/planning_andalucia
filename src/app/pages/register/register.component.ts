import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { IUser, IUserMetadata, ROLE } from '../../interfaces/IUser';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TOAST } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-register',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Output() toggle = new EventEmitter();

  public name!: FormControl;
  public last_name!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public registerForm!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService
  ) {
    this.initForm();
  }
  toggleForm() {
    this.toggle.emit();
    this.registerForm.reset();
  }

  public async doLogin() {
    const user: IUser = {
      email: this.email.value,
      password: this.password.value,
      role: ROLE.USER,
    };

    const metadata: IUserMetadata = {
      name: this.name.value,
      last_name: this.last_name.value,
    };

    try {
      this.spinnerService.show();
      await this.authService.create(user, metadata);
      this.spinnerService.hide();
      this.registerForm.reset();
      this.toggleForm();
      this.toastService.show({
        type: TOAST.SUCCESS,
        title: 'Nuevo usuario',
        message: 'Se ha registrado con exito',
      });
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Problema',
        message: 'Ha fallado el registro',
      });
      console.log('🚀  ~ RegisterComponent ~ doLogin ~ error:', error);
    }
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.last_name = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]);

    this.registerForm = new FormGroup({
      name: this.name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
    });
  }
}
