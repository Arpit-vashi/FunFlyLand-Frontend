import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../service/ticket.service';
import { TicketResponse } from '../../model/ticket/ticket-response.model';
import { MessageService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  providers: [MessageService]
})
export class TicketComponent implements OnInit {
  tickets: TicketResponse[] = [];

  constructor(private ticketService: TicketService, private messageService: MessageService) { }

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

  async generatePdfWithQRCode(ticket: TicketResponse) {
    if (ticket) {
      const doc = new jsPDF();

      const logo = new Image();
      logo.src = 'https://img.icons8.com/papercut/60/theme-park.png';
      const center = (doc.internal.pageSize.getWidth() / 2) - (30 / 2);
      doc.addImage(logo, 'PNG', center, 10, 30, 30);
      doc.setFontSize(16);
      doc.setFont('bold');
      doc.text("FunFlyLand", center, 50, { align: 'center' });

      let yPos = 80;
      const tableData = [];
      for (const [key, value] of Object.entries(ticket)) {
        if (key === 'foodOption') {
          const foodOptionValue = (value as any)?.name;
          tableData.push(['Food Option', foodOptionValue]);
        } else if (key === 'paymentMethod') {
          const paymentMethodValue = (value as any)?.value;
          tableData.push(['Payment Method', paymentMethodValue]);
        } else {
          tableData.push([key, value]);
        }
      }

      autoTable(doc, {
        startY: yPos,
        head: [['Field', 'Value']],
        body: tableData,
        styles: {
          fontSize: 10,
          fontStyle: 'bold',
        },
      });

      const totalCostY = yPos + 170;
      doc.setFont('bold');
      doc.text("Total cost:", 10, totalCostY);
      doc.setFont('normal');
      doc.text(`${ticket.totalAmount}`, 80, totalCostY);

      const qrText = JSON.stringify(ticket);
      const qrCodeSize = 30;
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const qrCodeX = pageWidth - qrCodeSize - margin;
      const qrCodeY = pageHeight - qrCodeSize - margin;

      const qrCodeDataUrl = await QRCode.toDataURL(qrText);
      doc.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Thanks visit again", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.height - 10, { align: 'center' });

      const fileName = `${ticket.firstName}_Ticket.pdf`;
      doc.save(fileName);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot generate PDF. Ticket data is invalid.' });
    }
  }
}
