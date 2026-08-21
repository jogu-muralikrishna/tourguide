import { PaymentProvider, PaymentRequest, PaymentResult, PaymentVerification } from './PaymentProvider';

export class DemoPaymentProvider implements PaymentProvider {
  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate brief payment gateway authorization round-trip
    await new Promise((resolve) => setTimeout(resolve, 500));

    const txId = `SIM-TX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return {
      success: true,
      transactionId: txId,
      status: 'PAID',
      isSimulated: true,
      timestamp: new Date().toISOString(),
      message: `Demo payment authorized: ${request.currency}${request.amount.toLocaleString()} (Simulated development environment, zero real funds transferred).`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      isValid: true,
      transactionId,
      amount: 0,
      status: 'PAID',
      isSimulated: true,
    };
  }

  async simulateRefund(transactionId: string, amount: number): Promise<{ success: boolean; refundId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      refundId: `SIM-REF-${Date.now()}`,
    };
  }
}
