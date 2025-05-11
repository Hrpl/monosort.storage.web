import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Omit<Product, 'id'> = { name: '', quantity: 0, supplier: '' };
  showAddForm = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  increaseQuantity(id: number, amount: number): void {
    this.productService.increaseQuantity(id, amount).subscribe(() => {
      this.loadProducts();
    });
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = { name: '', quantity: 0, supplier: '' };
      this.showAddForm = false;
    });
  }
}
