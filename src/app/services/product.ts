import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  // BURAYI DÜZELTTİK: Sadece /api kalsın, sonuna /products ekleme!
  private apiUrl = 'https://angular-net-backend.onrender.com/api';

  // 1. Ürünler
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product);
  }
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
  }

  // 2. Siparişler
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }
  addOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  // 3. Bayiler (Customers)
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customers`);
  }
  addCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers`, customer);
  }
  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/customers/${id}`, customer);
  }
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customers/${id}`);
  }
}