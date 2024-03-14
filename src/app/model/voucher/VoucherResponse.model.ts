export interface VoucherResponse {
    id: number;
    code: string;
    discount: number;
    validForNumberOfCustomers: number;
    validForNumberOfDays: number;
    validUntil: Date;
  }
  