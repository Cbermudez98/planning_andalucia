import { Component } from '@angular/core';
import { InputComponent } from '../../shared/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ReactiveFormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public email!: FormControl;
  public passowrd!: FormControl;
  public loginForm!: FormGroup;
  isLogin = true;
  toggleForm() {
    this.isLogin = !this.isLogin;
  }
}
