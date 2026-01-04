import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>Yeni Bayi Kaydı</h2>
        <input [(ngModel)]="userModel.full_name" placeholder="Ad Soyad">
        <input [(ngModel)]="userModel.email" type="email" placeholder="E-posta">
        <input [(ngModel)]="userModel.password" type="password" placeholder="Şifre">
        <select [(ngModel)]="userModel.role">
          <option value="bayi">Bayi</option>
          <option value="admin">Yönetici</option>
        </select>
        <button (click)="doRegister()">Kayıt Ol</button>
        <p>Zaten hesabınız var mı? <a routerLink="/">Giriş Yap</a></p>
      </div>
    </div>
  `,
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  auth = inject(AuthService);
  router = inject(Router);

  userModel = { full_name: '', email: '', password: '', role: 'bayi' };

  doRegister() {
    this.auth.register(this.userModel).subscribe({
      next: (res: any) => {
        alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
        this.router.navigate(['/']); // Başarılı olunca Login'e atar
      },
      error: (err) => alert("Hata: " + err.error)
    });
  }
}