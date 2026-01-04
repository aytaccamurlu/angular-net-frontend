import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router'; // RouterModule eklendi

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], // RouterModule buraya eklenmeli
  template: `
    <div class="login-box">
      <h2> Giriş Paneli</h2>
      <input [(ngModel)]="loginModel.email" placeholder="E-posta" type="email">
      <input [(ngModel)]="loginModel.password" placeholder="Şifre" type="password">
      <button (click)="doLogin()">Giriş Yap</button>
      
      <p style="text-align: center; margin-top: 10px; font-size: 14px;">
        Hesabınız yok mu? <a routerLink="/register" style="color: #007bff; cursor: pointer;">Kayıt Ol</a>
      </p>
    </div>
  `,
  styles: [`
    .login-box { 
      padding: 50px; 
      display: flex; 
      flex-direction: column; 
      width: 300px; 
      gap: 10px;
      margin: 100px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: sans-serif;
    }
    input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
  `]
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  loginModel = { email: '', password: '' };

doLogin() {
  this.auth.login(this.loginModel).subscribe({
    next: (res: any) => {
      // Backend'den dönen tüm kullanıcı nesnesini (full_name, role vb.) kaydediyoruz
      localStorage.setItem('user', JSON.stringify(res)); 
      
      alert("Giriş Başarılı!");
      this.router.navigate(['/dashboard']);
    },
    error: (err) => alert("Hata: " + err.error)
  });
}
}