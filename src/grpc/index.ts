import { useUserClient, UserClient } from "./user.client";
import { useTransactionClient, TransactionClient } from "./transaction.client";
import { useCategoryClient, CategoryClient } from "./category.client";
import { useBudgetClient, BudgetClient } from "./budget.client";
import { usePaymentClient, PaymentClient } from "./payment.client";
import { useOvdpClient, OvdpClient } from "./ovdp.client";
import { useCurrencyClient, CurrencyClient } from "./currency.client";
import { useNotificationClient, NotificationClient } from "./notification.client";

export interface GrpcClients {
  user: UserClient;
  transaction: TransactionClient;
  category: CategoryClient;
  budget: BudgetClient;
  payment: PaymentClient;
  ovdp: OvdpClient;
  currency: CurrencyClient;
  notification: NotificationClient;
}

export const grpcClients: GrpcClients = {
  user: useUserClient(),
  transaction: useTransactionClient(),
  category: useCategoryClient(),
  budget: useBudgetClient(),
  payment: usePaymentClient(),
  ovdp: useOvdpClient(),
  currency: useCurrencyClient(),
  notification: useNotificationClient(),
};
