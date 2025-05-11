import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://your-api.com/products'; // Замените на реальный API
  private products: Product[] = [
    { id: 1, name: 'Ноутбук', quantity: 5, supplier: 'Apple' },
    { id: 2, name: 'Смартфон', quantity: 10, supplier: 'Samsung' },
    { id: 3, name: 'Наушники', quantity: 8, supplier: 'Sony' }
  ];

  constructor(private http: HttpClient) {}

  // Получить все товары (имитация API)
  getProducts(): Observable<Product[]> {
    return of(this.products);
    // Реальный запрос: return this.http.get<Product[]>(this.apiUrl);
  }

  // Удалить товар
  deleteProduct(id: number): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    return of(undefined);
    // Реальный запрос: return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Добавить количество
  increaseQuantity(id: number, amount: number): Observable<void> {
    const product = this.products.find(p => p.id === id);
    if (product) product.quantity += amount;
    return of(undefined);
  }

  // Добавить новый товар
  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct = { ...product, id: this.products.length + 1 };
    this.products.push(newProduct);
    return of(newProduct);
    // Реальный запрос: return this.http.post<Product>(this.apiUrl, product);
  }
}
