import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>📦 Ürün ve Stok Yönetimi</h2>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ddd;">
        <h3 style="margin-top: 0;">{{ editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle' }}</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input [(ngModel)]="newProduct.name" placeholder="Ürün Adı" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <input [(ngModel)]="newProduct.category" placeholder="Kategori" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <input [(ngModel)]="newProduct.price" placeholder="Fiyat" type="number" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <input [(ngModel)]="newProduct.stock" placeholder="Stok" type="number" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          
          <button (click)="saveProduct()" [style.background]="editingId ? '#ffc107' : '#28a745'" style="color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer;">
            {{ editingId ? 'Güncelle' : 'Kaydet' }}
          </button>
          <button *ngIf="editingId" (click)="cancelEdit()" style="background: #6c757d; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer;">İptal</button>
        </div>
      </div>

      <table class="table" style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #007bff; color: white; text-align: left;">
            <th style="padding: 12px; border: 1px solid #ddd;">Ürün Adı</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Kategori</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Fiyat</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Stok</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products" style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; border: 1px solid #ddd;">{{ p.name }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ p.category }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ p.price | currency:'TRY':'symbol':'1.2-2' }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ p.stock }} Adet</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
              <button (click)="addToCart(p)" style="background: #17a2b8; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;" title="Siparişe Ekle">🛒</button>
              <button (click)="editProduct(p)" style="background: #ffc107; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;" title="Düzenle">✏️</button>
              <button (click)="deleteProduct(p.id)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" title="Sil">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="products.length === 0" style="text-align: center; padding: 20px; color: #777;">
        Henüz ürün bulunamadı.
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  products: any[] = [];
  editingId: any = null; // Hangi ürünün düzenlendiğini takip eder

  newProduct = { name: '', category: '', price: 0, stock: 0 };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => this.products = res);
  }

  // HEM KAYDETME HEM GÜNCELLEME İŞLEMİ
  saveProduct() {
    if (!this.newProduct.name || this.newProduct.price <= 0) {
      alert("Geçerli veri girin!");
      return;
    }

    if (this.editingId) {
      // GÜNCELLEME
      this.productService.updateProduct(this.editingId, this.newProduct).subscribe(() => {
        alert("Ürün güncellendi!");
        this.resetForm();
        this.loadProducts();
      });
    } else {
      // YENİ KAYIT
      this.productService.addProduct(this.newProduct).subscribe(() => {
        alert("Ürün eklendi!");
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  deleteProduct(id: any) {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      this.productService.deleteProduct(id).subscribe(() => {
        alert("Ürün silindi!");
        this.loadProducts();
      });
    }
  }

  editProduct(p: any) {
    this.editingId = p.id;
    this.newProduct = { ...p }; // Ürün bilgilerini forma doldur
  }

  addToCart(p: any) {
    // Burada sipariş sayfasına (Orders) veri gönderme mantığı çalışacak
    // Şimdilik LocalStorage üzerinden basit bir "Sepet" mantığı kurabiliriz
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...p, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${p.name} sipariş listesine eklendi!`);
  }

  resetForm() {
    this.newProduct = { name: '', category: '', price: 0, stock: 0 };
    this.editingId = null;
  }

  cancelEdit() {
    this.resetForm();
  }
}