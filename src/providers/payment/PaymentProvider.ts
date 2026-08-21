export interface PaymentRequest {
  bookingId: string;
  tripId: string;
  amount: number;
  currency: string;
  travelerEmail: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  isSimulated: boolean;
  timestamp: string;
  message: string;
  error?: string;
}

export interface PaymentVerification {
  isValid: boolean;
  transactionId: string;
  amount: number;
  status: 'PAID' | 'FAILED' | 'REFUNDED';
  isSimulated: boolean;
}

export interface PaymentProvider {
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerification>;
  simulateRefund(transactionId: string, amount: number): Promise<{ success: boolean; refundId: string }>;
}
