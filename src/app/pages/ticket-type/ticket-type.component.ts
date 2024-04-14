import { Component, OnInit } from '@angular/core';
import { TicketTypeService } from '../../service/tickettype.service';
import { TicketTypeRequest } from '../../model/ticket-type/ticket-type-request.model';
import { TicketTypeResponse } from '../../model/ticket-type/ticket-type-response.model';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.scss'],
  providers: [MessageService]
})
export class TicketTypeComponent implements OnInit {
  ticketTypes: TicketTypeResponse[] = [];
  ticket: TicketTypeRequest = { ticketTypeName: '', ticketTypePrice: null, ticketSpeed: '', promotion: false };
  editingTicket: TicketTypeResponse | null = null;
  promotionOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  speedOptions = [{ label: 'Fast', value: 'fast' }, { label: 'Medium', value: 'medium' }, { label: 'Slow', value: 'slow' }];

  constructor(private tickettypeService: TicketTypeService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadTicketTypes();
  }

  loadTicketTypes() {
    this.tickettypeService.getTicketTypes().subscribe(
      types => {
        this.ticketTypes = types;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket types loaded successfully' });
      },
      error => {
        console.error('Error loading ticket types:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load ticket types' });
      }
    );
  }

  // onSubmit(ticketForm: NgForm) {
  //   debugger
  //   if (ticketForm.valid) {
  //     const requestData = {
  //       ticketTypeName: this.ticket.ticketTypeName,
  //       ticketTypePrice: this.ticket.ticketTypePrice,
  //       ticketSpeed: this.ticket.ticketSpeed.value,
  //       promotion: this.ticket.promotion
  //     };

  //     this.tickettypeService.createTicketType(requestData).subscribe(
  //       newTicket => {
  //         this.ticketTypes.push(newTicket);
  //         this.resetForm(ticketForm);
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket type added successfully' });
  //       },
  //       error => {
  //         console.error('Error creating ticket type:', error);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add ticket type' });
  //       }
  //     );
  //   } else {
  //     console.log('Form is invalid.');
  //   }
  // }

  onSubmit(ticketForm: NgForm) {
    if (ticketForm.valid) {
      debugger

      const requestData = {
        ticketTypeName: this.ticket.ticketTypeName,
        ticketTypePrice: this.ticket.ticketTypePrice,
        ticketSpeed: this.ticket.ticketSpeed.value,
        promotion: this.ticket.promotion = 'true' ? true : false
      };

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket type added successfully' });

      this.tickettypeService.createTicketType(requestData).subscribe(newTicket => {
        this.ticketTypes.push(newTicket);
        this.resetForm(ticketForm);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add ticket type' });
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add ticket type' });
    }
  }

  editTicket(ticket: TicketTypeResponse) {
    this.editingTicket = ticket;
  }

  saveTicketType() {
    if (this.editingTicket) {
      this.updateTicket(this.editingTicket);
      this.editingTicket = null;
    }
  }

  updateTicket(ticket: TicketTypeResponse) {
    const requestData = {
      ticketTypeName: ticket.ticketTypeName,
      ticketTypePrice: ticket.ticketTypePrice,
      ticketSpeed: ticket.ticketSpeed,
      promotion: ticket.promotion
    };

    this.tickettypeService.updateTicketType(ticket.id, requestData).subscribe(
      updatedTicket => {
        const index = this.ticketTypes.findIndex(t => t.id === updatedTicket.id);
        if (index !== -1) {
          this.ticketTypes[index] = updatedTicket;
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket type updated successfully' });
      },
      error => {
        console.error('Error updating ticket type:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update ticket type' });
      }
    );
  }

  deleteTicket(id: number) {
    this.tickettypeService.deleteTicketType(id).subscribe(
      () => {
        this.ticketTypes = this.ticketTypes.filter(t => t.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket type deleted successfully' });
      },
      error => {
        console.error('Error deleting ticket type:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete ticket type' });
      }
    );
  }

  cancelEdit() {
    this.editingTicket = null;
  }

  resetForm(form: NgForm) {
    form.reset();
    this.ticket = { ticketTypeName: '', ticketTypePrice: null, ticketSpeed: '', promotion: false };
  }
}
