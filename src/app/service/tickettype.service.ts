import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketTypeRequest } from '../model/ticket-type/ticket-type-request.model';
import {  TicketTypeResponse } from '../model/ticket-type/ticket-type-response.model';

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {
  private baseUrl = 'http://localhost:8080/ticket-types';

  constructor(private http: HttpClient) { }

  getTicketTypes(): Observable<TicketTypeResponse[]> {
    return this.http.get<TicketTypeResponse[]>(this.baseUrl);
  }

  createTicketType(ticketType: TicketTypeRequest): Observable<TicketTypeResponse> {
    return this.http.post<TicketTypeResponse>(this.baseUrl, ticketType);
  }

  updateTicketType(id: number, ticketType: TicketTypeRequest): Observable<TicketTypeResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<TicketTypeResponse>(url, ticketType);
  }

  deleteTicketType(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
