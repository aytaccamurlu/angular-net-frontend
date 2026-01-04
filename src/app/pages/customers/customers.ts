import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4 bg-light min-vh-100">
      
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <h2 class="fw-bold text-dark mb-1">👥 Bayi ve Cari Yönetimi</h2>
          <p class="text-muted">Sistemde kayıtlı tüm bayilerin listesi ve cari işlemleri.</p>
        </div>
        <div class="col-md-6 text-md-end">
          <button class="btn" [ngClass]="showForm ? 'btn-outline-danger' : 'btn-primary shadow'" (click)="toggleForm()">
            <span *ngIf="!showForm">➕ Yeni Bayi Tanımla</span>
            <span *ngIf="showForm">✖ Formu Kapat</span>
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4 animate__animated animate__fadeIn" *ngIf="showForm">
        <div class="card-header bg-white py-3">
          <h5 class="card-title mb-0 fw-bold" [class.text-warning]="editingId" [class.text-success]="!editingId">
            {{ editingId ? '📝 Bayi Bilgilerini Güncelle' : '✨ Yeni Bayi Kaydı' }}
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-semibold">Firma Adı</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">🏢</span>
                <input [(ngModel)]="customer.companyName" class="form-control bg-light border-start-0" placeholder="Örn: ABC Teknoloji Ltd.">
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Yetkili Kişi</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">👤</span>
                <input [(ngModel)]="customer.contactName" class="form-control bg-light border-start-0" placeholder="Ad Soyad">
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label fw-semibold">Bölge/Şehir</label>
              <select [(ngModel)]="customer.city" class="form-select bg-light">
                <option value="">Seçiniz...</option>
                <option value="İstanbul">İstanbul</option>
                <option value="Ankara">Ankara</option>
                <option value="İzmir">İzmir</option>
                <option value="Eskişehir">Eskişehir</option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-dark w-100 fw-bold py-2" (click)="save()">
                {{ editingId ? 'Güncelle' : 'Kaydet' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-dark text-white">
                <tr>
                  <th class="ps-4 py-3">ID</th>
                  <th>Bayi Bilgisi</th>
                  <th>Yetkili</th>
                  <th>Konum</th>
                  <th>Durum</th>
                  <th class="text-center pe-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of customers">
                  <td class="ps-4">
                    <span class="badge bg-light text-dark border">#{{ c.id }}</span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm me-3 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                        {{ c.companyName.substring(0,1) }}
                      </div>
                      <div>
                        <div class="fw-bold text-dark">{{ c.companyName }}</div>
                        <small class="text-muted">B2B Kayıtlı Bayi</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ c.contactName }}</td>
                  <td>
                    <i class="bi bi-geo-alt me-1"></i> {{ c.city }}
                  </td>
                  <td>
                    <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle">
                      ● Aktif
                    </span>
                  </td>
                  <td class="text-center pe-4">
                    <div class="btn-group">
                      <button class="btn btn-sm btn-white border shadow-sm me-1" (click)="edit(c)" title="Düzenle">
                        <span class="text-warning">✏️</span>
                      </button>
                      <button class="btn btn-sm btn-white border shadow-sm" (click)="delete(c.id)" title="Sil">
                        <span class="text-danger">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="customers.length === 0">
                  <td colspan="6" class="text-center py-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" width="80" class="mb-3 opacity-50">
                    <p class="text-muted fw-bold">Henüz kayıtlı bayi bulunmuyor.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  service = inject(ProductService);
  customers: any[] = [];
  showForm = false;
  editingId: any = null;

  customer = { companyName: '', contactName: '', city: '' };

  ngOnInit() { this.getList(); }

  getList() {
    this.service.getCustomers().subscribe(res => this.customers = res);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  save() {
    if (this.editingId) {
      this.service.updateCustomer(this.editingId, this.customer).subscribe(() => {
        this.resetForm();
        this.getList();
      });
    } else {
      this.service.addCustomer(this.customer).subscribe(() => {
        this.resetForm();
        this.getList();
      });
    }
  }

  edit(c: any) {
    this.editingId = c.id;
    this.customer = { ...c };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Form açıldığında yukarı kaydır
  }

  delete(id: number) {
    if (confirm('Bu bayiyi silmek istediğinize emin misiniz?')) {
      this.service.deleteCustomer(id).subscribe(() => this.getList());
    }
  }

  resetForm() {
    this.customer = { companyName: '', contactName: '', city: '' };
    this.editingId = null;
    this.showForm = false;
  }
}