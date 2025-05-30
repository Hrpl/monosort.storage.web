import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Supply {
  id: number;
  date: string;
}

interface SupplyItem {
  count: number;
  name?: string;
}

@Component({
  selector: 'app-supplies',
  standalone: true,
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SuppliesComponent implements OnInit {
  supplies: Supply[] = [];
  supplyDetails: SupplyItem[] = [];
  selectedSupplyId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSupplies();
  }

  loadSupplies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Supply[]>('https://storage.monosortcoffee.ru/api/supply/all')
      .subscribe({
        next: (supplies) => {
          this.supplies = supplies;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке списка поставок:', error);
          this.errorMessage = 'Не удалось загрузить список поставок';
          this.isLoading = false;
        }
      });
  }

  loadSupplyDetails(supplyId: number): void {
    this.selectedSupplyId = supplyId;
    this.isLoading = true;

    this.http.get<SupplyItem[]>(`https://storage.monosortcoffee.ru/api/supply?id=${supplyId}`)
      .subscribe({
        next: (items) => {
          this.supplyDetails = items;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке деталей поставки:', error);
          this.errorMessage = 'Не удалось загрузить детали поставки';
          this.isLoading = false;
        }
      });
  }
}
