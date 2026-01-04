import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>🛒 Yeni Sipariş Oluştur</h2>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h4>Sepetteki Ürünler</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="text-align: left; border-bottom: 2px solid #eee;">
                <th style="padding: 10px;">Ürün</th>
                <th style="padding: 10px;">Fiyat</th>
                <th style="padding: 10px;">Adet</th>
                <th style="padding: 10px;">Toplam</th>
                <th style="padding: 10px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cart" style="border-bottom: 1px solid #f9f9f9;">
                <td style="padding: 10px;">{{ item.name }}</td>
                <td style="padding: 10px;">{{ item.price | currency:'TRY' }}</td>
                <td style="padding: 10px;">
                  <button (click)="changeQuantity(item, -1)" style="padding: 2px 8px;">-</button>
                  <span style="margin: 0 10px; font-weight: bold;">{{ item.quantity }}</span>
                  <button (click)="changeQuantity(item, 1)" style="padding: 2px 8px;">+</button>
                </td>
                <td style="padding: 10px;">{{ item.price * item.quantity | currency:'TRY' }}</td>
                <td style="padding: 10px;">
                  <button (click)="removeFromCart(item)" style="color: red; border: none; background: none; cursor: pointer;">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="cart.length === 0" style="padding: 20px; text-align: center; color: #999;">
            Sepetiniz boş. Ürünler sayfasından ekleme yapın.
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #ddd; height: fit-content;">
          <h4>Sipariş Özeti</h4>
          
          <div style="margin-bottom: 15px;">
            <label>Bayi Seçin:</label>
            <select [(ngModel)]="selectedCustomerId" style="width: 100%; padding: 8px; margin-top: 5px;">
              <option [value]="null">--- Bayi Seçiniz ---</option>
              <option *ngFor="let c of customers" [value]="c.id">{{ c.companyName }}</option>
            </select>
          </div>

          <hr>
          
          <div style="margin-top: 15px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Ara Toplam:</span>
              <span>{{ subTotal | currency:'TRY' }}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 10px; align-items: center;">
              <span>İskonto (%):</span>
              <input type="number" [(ngModel)]="discountRate" (input)="calculateTotal()" style="width: 60px; padding: 5px;">
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 20px; font-weight: bold; font-size: 1.2em; color: #28a745;">
              <span>Genel Toplam:</span>
              <span>{{ grandTotal | currency:'TRY' }}</span>
            </div>

            <button (click)="submitOrder()" [disabled]="cart.length === 0 || !selectedCustomerId" 
                    style="width: 100%; margin-top: 20px; padding: 12px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
              Siparişi Onayla
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  productService = inject(ProductService);
  
  cart: any[] = [];
  customers: any[] = [];
  selectedCustomerId: any = null;
  
  subTotal = 0;
  discountRate = 0;
  grandTotal = 0;

  ngOnInit() {
    this.loadCart();
    this.loadCustomers();
  }

  loadCart() {
    // Products sayfasında eklediğimiz ürünleri LocalStorage'dan alıyoruz
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.calculateTotal();
    }
  }

  loadCustomers() {
    this.productService.getCustomers().subscribe(res => this.customers = res);
  }

  changeQuantity(item: any, amount: number) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      this.removeFromCart(item);
    } else {
      this.saveCart();
      this.calculateTotal();
    }
  }

  removeFromCart(item: any) {
    this.cart = this.cart.filter(x => x.id !== item.id);
    this.saveCart();
    this.calculateTotal();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  calculateTotal() {
    this.subTotal = this.cart.reduce((acc, obj) => acc + (obj.price * obj.quantity), 0);
    const discountAmount = (this.subTotal * this.discountRate) / 100;
    this.grandTotal = this.subTotal - discountAmount;
  }

  submitOrder() {
    const orderData = {
      customerId: this.selectedCustomerId,
      totalAmount: this.grandTotal,
      discount: this.discountRate,
      orderDate: new Date(),
      details: this.cart.map(x => ({ productId: x.id, quantity: x.quantity, price: x.price }))
    };

    this.productService.addOrder(orderData).subscribe({
      next: () => {
        alert("Sipariş başarıyla oluşturuldu!");
        this.cart = [];
        localStorage.removeItem('cart');
        this.selectedCustomerId = null;
        this.discountRate = 0;
        this.calculateTotal();
      },
      error: () => alert("Sipariş kaydedilirken bir hata oluştu!")
    });
  }
}