export interface VoucherRequest {
    code: string;
    discount: number;
    validForNumberOfCustomers: number;
    validForNumberOfDays: number;
    validUntil: Date;
  }
  