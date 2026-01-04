import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  public router = inject(Router); // public olması HTML'den erişim için şart
  user: any = {}; 
ngOnInit() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    this.user = JSON.parse(savedUser);
  } else {
    // BURAYI ŞİMDİLİK KAPAT, HATA NEREDE GÖRELİM:
    console.log("Kullanıcı yok ama şimdilik Login'e atmıyorum.");
    // this.router.navigate(['/login']); 
  }
}
  

  cikisYap() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}