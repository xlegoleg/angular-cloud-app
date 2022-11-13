/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@angular/core';

import { EMPTY, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    const url = this.getUrl('product', 'products');
    return this.http.post<Product>(url, product, {
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  editProduct(id: string, changedProduct: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', `products/${id}`);
    return this.http.put<Product>(url, changedProduct);
  }

  getProductById(id: string): Observable<Product | null> {
    const url = this.getUrl('product', `products/${id}`);
    try {
      return this.http
        .get<{ product: Product }>(url)
        .pipe(map((resp) => resp.product));
    } catch (e) {
      console.error(`An error occurred while getting product with ${id} - id`)
      return of(null);
    }
  }

  getProducts(): Observable<Product[]> {
    const url = this.getUrl('product', 'products');
    try {
     return this.http.get<any>(url).pipe(map((resp) => resp.products));
    } catch (e) {
      console.error('An error occurred while getting products')
      return of([]);
    }
  }

  getProductsForCheckout(ids: string[]): Observable<Product[]> {
    if (!ids.length) {
      return of([]);
    }

    return this.getProducts().pipe(
      map((products) => products.filter((product) => ids.includes(product.id)))
    );
  }
}
