import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private http = inject(HttpClient);
   private API = 'https://angular-net-backend.onrender.com';
  // Modeller - Başlangıç değerleri
  settings: any = { companyName: '', taxInfo: '', currency: 'TRY' };
  users: any[] = [];
  newUser: any = { full_name: '', email: '', password: '', role: 'dealer' };
  
  loading = false;
  isEditMode = false;
  selectedUserId: string | null = null;

  ngOnInit() {
    // SAYFA AÇILDIĞINDA ÇALIŞACAKLAR
    this.getSettings(); 
    this.getUsers(); 
  }

  // --- KULLANICI İŞLEMLERİ ---

  getUsers() {
    this.http.get<any[]>('${this.API}/api/users').subscribe({
      next: (res) => {
        console.log("Gelen Kullanıcılar:", res); // F12 Console'dan kontrol için
        this.users = res;
      },
      error: (err) => console.error("Kullanıcılar yüklenemedi", err)
    });
  }

  saveUser() {
    if (this.isEditMode && this.selectedUserId) {
      this.http.put(`${this.API}/api/users/${this.selectedUserId}`, this.newUser).subscribe(() => {
        alert('Kullanıcı güncellendi');
        this.resetForm();
        this.getUsers();
      });
    } else {
      this.http.post(`${this.API}/api/users`, this.newUser).subscribe(() => {
        alert('Kullanıcı eklendi');
        this.resetForm();
        this.getUsers();
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      this.http.delete(`${this.API}/api/users/${id}`).subscribe(() => {
        this.getUsers();
      });
    }
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.newUser = { ...user };
  }

  changeUserRole(userId: string, newRole: string) {
    this.http.put(`${this.API}/api/users/${userId}/role`, JSON.stringify(newRole), {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(() => alert('Yetki güncellendi!'));
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.newUser = { full_name: '', email: '', password: '', role: 'dealer' };
  }

  // --- FİRMA AYARLARI ---


 // Değişkeni dizi (array) yapıyoruz
activeSettings: any = { companyName: '', taxInfo: '', currency: 'TRY' }; 

// 2. Altta liste olarak görünen dizi:
settingsList: any[] = [];
getSettings() {
  this.http.get<any[]>('${this.API}/api/settings').subscribe({
    next: (res) => {
      // Backend'den gelen veriyi settingsList dizisine aktarıyoruz
      this.settingsList = Array.isArray(res) ? res : (res ? [res] : []);
      
      console.log("Firmalar Listelendi:", this.settingsList); // Kontrol için

      // Formun (kutuların) içini en son kayıtla doldurmak isterseniz:
      if (this.settingsList.length > 0) {
        this.activeSettings = { ...this.settingsList[this.settingsList.length - 1] };
      }
    },
    error: (err) => console.error("Ayarlar çekilemedi:", err)
  });
}

 // 1. Formu tamamen temizleyen fonksiyon
prepareNewSettings() {
  this.activeSettings = { 
    id: undefined, // ID'yi siliyoruz ki yeni kayıt olarak gitsin
    companyName: '', 
    taxInfo: '', 
    currency: 'TRY' 
  };
}

// 2. Kaydetme fonksiyonu
saveGeneralSettings() {
  this.loading = true;

  // 1. LocalStorage'dan mevcut kullanıcının rolünü alalım
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = savedUser.role || 'admin'; // Eğer boşsa varsayılan admin ata

  // 2. Gönderilecek objeye userRole alanını ekle
  const dataToSend = {
    ...this.activeSettings,
    userRole: role // Backend'in beklediği eksik alan
  };

  const request = this.activeSettings.id 
    ? this.http.put(`${this.API}/api/settings/${this.activeSettings.id}`, dataToSend)
    : this.http.post(`${this.API}/api/settings`, dataToSend);

 request.subscribe({
  next: (res: any) => {
    alert('Firma ayarları kaydedildi!');

    if (this.activeSettings.id) {
      // UPDATE
      const i = this.settingsList.findIndex(x => x.id === this.activeSettings.id);
      if (i !== -1) {
        this.settingsList[i] = res;
      }
    } else {
      // CREATE
      this.settingsList.push(res);
    }

    // 🔥 Angular change detection zorla
    this.settingsList = [...this.settingsList];

    // formu temizle
    this.prepareNewSettings();
    this.loading = false;
  },
  error: (err) => {
    console.error(err);
    this.loading = false;
  }
});

}
}