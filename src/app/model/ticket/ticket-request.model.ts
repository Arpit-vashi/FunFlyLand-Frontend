export interface TicketRequest {
    firstName: string;
    lastName: string;
    address: string;
    mobileNumber: string;
    email: string;
    promotionCode: string;
    numberOfAdults: number;
    numberOfChildren: number;
    ticketType: string;
    foodOption: string;
    totalAmount: number;
    taxAmount: number;
    paymentMethod: string;
    date: Date;
  }
  