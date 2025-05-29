import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  count_in_storage: number;
  last_order: string;
  measure: string;
}

interface NewProduct {
  provider_id: number;
  name: string;
  count_in_storage: number;
  last_order: string;
  measure: string;
}

@Component({
  standalone: true,
  selector: 'app-product-management',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  showDeleteModal = false;
  showAddModal = false;
  productIdToDelete: number | null = null;
  errorMessage = '';
  newProduct: NewProduct = {
    provider_id: 1,
    name: '',
    count_in_storage: 0,
    last_order: new Date().toISOString().split('T')[0],
    measure: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.products = await this.http.get<Product[]>('https://storage.monosortcoffee.ru/api/product').toPromise() || [];
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error);
      this.errorMessage = 'Не удалось загрузить список продуктов';
    } finally {
      this.isLoading = false;
    }
  }

  openDeleteModal(id: number): void {
    this.productIdToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.productIdToDelete === null) return;

    this.isLoading = true;
    this.http.delete(`https://storage.monosortcoffee.ru/api/product?id=${this.productIdToDelete}`)
      .subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== this.productIdToDelete);
          this.isLoading = false;
          this.showDeleteModal = false;
          this.productIdToDelete = null;
        },
        error: (error) => {
          console.error('Ошибка при удалении продукта:', error);
          this.errorMessage = 'Не удалось удалить продукт';
          this.isLoading = false;
          this.showDeleteModal = false;
          this.productIdToDelete = null;
        }
      });
  }

  openAddModal(): void {
    this.showAddModal = true;
    // Сброс формы
    this.newProduct = {
      provider_id: 1,
      name: '',
      count_in_storage: 0,
      last_order: new Date().toISOString().split('T')[0],
      measure: ''
    };
  }

  cancelAdd(): void {
    this.showAddModal = false;
  }

  submitAddProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('https://storage.monosortcoffee.ru/api/product', this.newProduct, { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status === 201) {
            // Обновляем список товаров после успешного добавления
            this.fetchProducts();
            this.showAddModal = false;
          } else {
            this.errorMessage = 'Не удалось добавить товар';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при добавлении товара:', error);
          this.errorMessage = 'Не удалось добавить товар';
          this.isLoading = false;
        }
      });
  }

  createSupply(): void {
    // Логика создания поставки
    console.log('Создание новой поставки');
  }
}
