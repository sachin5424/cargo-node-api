import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public LoginFormError: any
  public loginSpinner:boolean = false
  public LoginForm = new FormGroup({
    email: new FormControl(null, [Validators.email]),
    password: new FormControl(null, [Validators.min(3)])
  })
  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
  }
  Login() {
    this.loginSpinner = true
    // alert("ok")
    if (this.LoginForm.valid) {
      
      const data$ = this._authService.testFnLogin(this.LoginForm.value)
      data$.subscribe((res: any) => {
        console.log(res);
        window.localStorage.setItem('token',res.accessToken)
      this.loginSpinner = false
        this._authService.LoginRoutes(res.accessToken)

      }, (err: any) => {
        console.log("err", err);
       
        this.loginSpinner = false
        this.LoginFormError = err.error.errors
      })

    }
  
  }
}
