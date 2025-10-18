import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserLoginModel } from '../../models/userLoginModel';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  userLoginModel: UserLoginModel | null = null;
  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  });

  constructor(private authSvc: AuthenticationService) {}

  LoginUser() {
    if (this.loginForm.valid) {
      console.log("Logging in...");

      this.userLoginModel = {
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? ''
      }

      this.authSvc.loginUser(this.userLoginModel).subscribe({
        next: (response) => {
          const token = (<any>response).tokenToSend;
          localStorage.setItem("Bearer", token);
        },
        error: (err) => {console.log(err)} 
      });
    }
  }
}
