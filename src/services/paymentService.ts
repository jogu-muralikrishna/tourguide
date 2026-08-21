import { PaymentRequest, PaymentResult, PaymentVerification } from '../providers/payment/PaymentProvider';
import { DemoPaymentProvider } from '../providers/payment/demoPaymentProvider';

const provider = new DemoPaymentProvider();

export class PaymentService {
  static async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    return provider.createPayment(request);
  }

  static async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    return provider.verifyPayment(transactionId);
  }

  static async refundPayment(transactionId: string, amount: number): Promise<{ success: boolean; refundId: string }> {
    return provider.simulateRefund(transactionId, amount);
  }
}
