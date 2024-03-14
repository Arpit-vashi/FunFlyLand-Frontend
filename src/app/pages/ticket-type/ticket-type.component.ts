import { Component, OnInit } from '@angular/core';
import { TicketTypeService } from '../../service/tickettype.service';
import { TicketTypeRequest } from '../../model/ticket-type/ticket-type-request.model';
import { TicketTypeResponse } from '../../model/ticket-type/ticket-type-response.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.scss']
})
export class TicketTypeComponent implements OnInit {
  ticketTypes: TicketTypeResponse[] = [];
  ticket: TicketTypeRequest = { ticketTypeName: '', ticketTypePrice: null, ticketSpeed: '', promotion: false };
  editingTicket: TicketTypeResponse | null = null; // Track currently editing ticket
  promotionOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  speedOptions = [{ label: 'Fast', value: 'fast' }, { label: 'Medium', value: 'medium' }, { label: 'Slow', value: 'slow' }];

  constructor(private tickettypeService: TicketTypeService) {}

  ngOnInit(): void {
    this.loadTicketTypes();
  }

  loadTicketTypes() {
    this.tickettypeService.getTicketTypes().subscribe(types => {
      this.ticketTypes = types;
      console.log(this.ticketTypes);
    });
  }

  onSubmit(ticketForm: NgForm) {
    if (ticketForm.valid) {
      debugger

      const requestData = {
        ticketTypeName: this.ticket.ticketTypeName,
        ticketTypePrice: this.ticket.ticketTypePrice,
        ticketSpeed: this.ticket.ticketSpeed.value,
        promotion: this.ticket.promotion = 'true' ? true : false
      };

      console.log('Form Data:', requestData);

      this.tickettypeService.createTicketType(requestData).subscribe(newTicket => {
        this.ticketTypes.push(newTicket);
        this.resetForm(ticketForm);
      }, error => {
        console.error('Error creating ticket type:', error);
      });
    } else {
      console.log('Form is invalid.');
    }
  }

  editTicket(ticket: TicketTypeResponse) {
    this.editingTicket = ticket; // Set the editing ticket
  }

  saveTicketType() {
    debugger
    if (this.editingTicket) {
      this.updateTicket(this.editingTicket);
      this.editingTicket = null; // Reset editing state
    }
  }

  updateTicket(ticket: TicketTypeResponse) {
    debugger
    let tickedSpeedValue = ticket.ticketSpeed.valueOf
    const requestData = {
      ticketTypeName: ticket.ticketTypeName,
      ticketTypePrice: ticket.ticketTypePrice,
      ticketSpeed: ticket.ticketSpeed,
      promotion: ticket.promotion
    };

    this.tickettypeService.updateTicketType(ticket.id, requestData).subscribe(updatedTicket => {
      const index = this.ticketTypes.findIndex(t => t.id === updatedTicket.id);
      if (index !== -1) {
        this.ticketTypes[index] = updatedTicket;
      }
    }, error => {
      console.error('Error updating ticket type:', error);
    });
  }

  deleteTicket(id: number) {
    this.tickettypeService.deleteTicketType(id).subscribe(() => {
      this.ticketTypes = this.ticketTypes.filter(t => t.id !== id);
    }, error => {
      console.error('Error deleting ticket type:', error);
    });
  }

  cancelEdit() {
    this.editingTicket = null; // Cancel editing
  }

  resetForm(form: NgForm) {
    form.reset();
    this.ticket = { ticketTypeName: '', ticketTypePrice: null, ticketSpeed: '', promotion: false };
  }
}
