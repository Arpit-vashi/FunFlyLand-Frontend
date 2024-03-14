import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CashierRequest } from "./../model/cashier/cashier-request.model";
import { CashierResponse } from "./../model/cashier/cashier-response.model";

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private baseUrl = 'http://localhost:8080/cashiers'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Create a new cashier
  createCashier(cashier: CashierRequest): Observable<CashierResponse> {
    return this.http.post<CashierResponse>(this.baseUrl, cashier);
  }

  // Get all cashiers
  getAllCashiers(): Observable<CashierResponse[]> {
    return this.http.get<CashierResponse[]>(this.baseUrl);
  }

  // Get cashier by ID
  getCashierById(id: number): Observable<CashierResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<CashierResponse>(url);
  }

  // Update cashier
  updateCashier(id: number, updatedCashier: CashierResponse): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, updatedCashier);
  }  

  // Delete cashier
  deleteCashier(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
