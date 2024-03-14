import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../service/ticket.service';
import { TicketResponse } from '../../model/ticket/ticket-response.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  providers:[MessageService]
})
export class TicketComponent implements OnInit {
  tickets: TicketResponse[] = [];

  constructor(private ticketService: TicketService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getAllTickets().subscribe(
      tickets => {
        this.tickets = tickets;
      },
      error => {
        console.error('Error loading tickets:', error);
        // Handle error - show an error message to the user
      }
    );
  }
  deleteTicket(ticketId: number) {
    this.ticketService.deleteTicket(ticketId).subscribe(
      () => {
        // Remove the deleted ticket from the local array
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket deleted successfully' });
      },
      error => {
        console.error('Error deleting ticket:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete ticket' });
      }
    );
  }
}
