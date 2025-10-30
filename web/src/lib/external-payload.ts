export type ExternalPayload = {
  orderNumber: string;
  amountCents: number;
  method: 'billetera' | 'transferencia' | 'credito';
  type?: 'qr' | 'cci';
  efimero?: Record<string, any> | null;
  createdAt: string;
};

export function buildExternalPayload(params: {
  orderNumber: string;
  amountCents: number;
  method: 'billetera' | 'transferencia' | 'credito';
  type?: 'qr' | 'cci';
  efimero?: any;
}): ExternalPayload {
  const { orderNumber, amountCents, method, type, efimero } = params;
  return {
    orderNumber,
    amountCents,
    method,
    type,
    efimero: efimero ?? null,
    createdAt: new Date().toISOString(),
  };
}
