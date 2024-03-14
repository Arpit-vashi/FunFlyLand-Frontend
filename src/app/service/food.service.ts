import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodRequest } from '../model/food/food-request.model';
import { FoodResponse } from '../model/food/food-response.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private baseUrl = 'http://localhost:8080/foods';

  constructor(private http: HttpClient) { }

  getAllFoods(): Observable<FoodResponse[]> {
    return this.http.get<FoodResponse[]>(this.baseUrl);
  }

  getFoodById(id: number): Observable<FoodResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<FoodResponse>(url);
  }

  addFood(food: FoodRequest): Observable<FoodResponse> {
    return this.http.post<FoodResponse>(this.baseUrl, food);
  }

  updateFood(id: number, food: FoodRequest): Observable<FoodResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<FoodResponse>(url, food);
  }

  deleteFood(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
