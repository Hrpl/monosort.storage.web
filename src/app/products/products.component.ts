import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

interface ProductShort {
  id: number;
  name: string;
}

interface SupplyProduct {
  count: number;
  supplyId: number;
  productId: number;
}

interface NewSupply {
  date: string;
  supplyProduct: SupplyProduct[];
}

interface FilterParams {
  search: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

@Component({
  standalone: true,
  selector: 'app-product-management',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  availableProducts: ProductShort[] = [];
  isLoading = true;
  showDeleteModal = false;
  showAddModal = false;
  showSupplyModal = false;
  showAddProductToSupplyModal = false;
  productIdToDelete: number | null = null;
  errorMessage = '';

  // Фильтры и сортировка
  filterParams: FilterParams = {
    search: '',
    sortBy: 'name',
    sortOrder: 'ASC'
  };

  // Доступные поля для сортировки
  sortFields = [
    { value: 'name', label: 'Название' },
    { value: 'count_in_storage', label: 'Количество' },
    { value: 'last_order', label: 'Дата последнего заказа' }
  ];

  newProduct: NewProduct = {
    provider_id: 1,
    name: '',
    count_in_storage: 0,
    last_order: new Date().toISOString().split('T')[0],
    measure: ''
  };

  newSupply: NewSupply = {
    date: new Date().toISOString().split('T')[0],
    supplyProduct: []
  };

  supplyProducts: SupplyProduct[] = [];
  selectedProductId: number | null = null;
  selectedProductCount: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.http.post<Product[]>(
        'https://storage.monosortcoffee.ru/api/product/find',
        this.filterParams
      ).toPromise();

      this.products = response || [];
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error);
      this.errorMessage = 'Не удалось загрузить список продуктов';
    } finally {
      this.isLoading = false;
    }
  }

  // Применение фильтров
  applyFilters(): void {
    this.fetchProducts();
  }

  // Сброс фильтров
  resetFilters(): void {
    this.filterParams = {
      search: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    };
    this.fetchProducts();
  }

  // Изменение порядка сортировки
  toggleSortOrder(): void {
    this.filterParams.sortOrder = this.filterParams.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.fetchProducts();
  }

  // Остальные методы остаются без изменений
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
    console.log('Создание новой поставки');
  }

  openSupplyModal(): void {
    this.showSupplyModal = true;
    this.newSupply = {
      date: new Date().toISOString().split('T')[0],
      supplyProduct: []
    };
    this.supplyProducts = [];
    this.loadAvailableProducts();
  }

  cancelSupply(): void {
    this.showSupplyModal = false;
  }

  loadAvailableProducts(): void {
    this.http.get<ProductShort[]>('https://storage.monosortcoffee.ru/api/product/short_data')
      .subscribe({
        next: (products) => {
          this.availableProducts = products;
        },
        error: (error) => {
          console.error('Ошибка при загрузке списка товаров:', error);
          this.errorMessage = 'Не удалось загрузить список товаров';
        }
      });
  }

  openAddProductToSupplyModal(): void {
    this.showAddProductToSupplyModal = true;
    this.selectedProductId = null;
    this.selectedProductCount = 1;
  }

  cancelAddProductToSupply(): void {
    this.showAddProductToSupplyModal = false;
  }

  addProductToSupply(): void {
    if (!this.selectedProductId || !this.selectedProductCount) return;

    const existingProductIndex = this.supplyProducts.findIndex(
      item => item.productId === this.selectedProductId
    );

    if (existingProductIndex >= 0) {
      this.supplyProducts[existingProductIndex].count += this.selectedProductCount;
    } else {
      this.supplyProducts.push({
        productId: this.selectedProductId!,
        count: this.selectedProductCount,
        supplyId: 0
      });
    }

    this.showAddProductToSupplyModal = false;
  }

  removeSupplyProduct(productId: number): void {
    this.supplyProducts = this.supplyProducts.filter(
      item => item.productId !== productId
    );
  }

  getProductName(productId: number): string {
    const product = this.availableProducts.find(p => p.id == productId);
    return product ? product.name : 'Неизвестный товар';
  }

  getProductMeasure(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.measure : '';
  }

  createSupplySubmit(): void {
    if (this.supplyProducts.length === 0) return;

    this.isLoading = true;
    this.errorMessage = '';

    const supplyData = {
      date: this.newSupply.date,
      supplyProduct: this.supplyProducts.map(item => ({
        count: item.count,
        productId: item.productId
      }))
    };

    this.http.post('https://storage.monosortcoffee.ru/api/supply', supplyData, { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status === 201) {
            this.showSupplyModal = false;
            this.fetchProducts();
          } else {
            this.errorMessage = 'Не удалось создать поставку';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при создании поставки:', error);
          this.errorMessage = 'Не удалось создать поставку';
          this.isLoading = false;
        }
      });
  }
}
