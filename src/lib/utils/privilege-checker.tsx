import { useAppState } from "lib/context/app";

export const usePrivilegeChecker = () => {
  const [state]: any = useAppState();

  const hasPrivilege = (actionCode: string): boolean => {
    if (!state.userRole || !Array.isArray(state.userRole)) {
      return false;
    }

    const privilege = state.userRole.find(
      (role: any) => role.ActionCode === actionCode && role.Status === true
    );

    return !!privilege;
  };

  const hasAnyPrivilege = (actionCodes: string[]): boolean => {
    return actionCodes.some(code => hasPrivilege(code));
  };

  return {
    hasPrivilege,
    hasAnyPrivilege
  };
};

export const RATE_PRIVILEGES = {
  OVERVIEW: 'ConfigRates',
  SEASONS: 'ConfigSeasons',
  RATE_TYPES: 'ConfigRates',
  RATES: 'ConfigRates',
  PAYMENT_METHODS: 'ConfigPaymentMethod',
  INCLUSIONS: 'ConfigInclusions',
  EXTRA_CHARGES: 'ConfigExtraCharges',
  EXTRA_CHARGE_GROUPS: 'ConfigExtraChargeGroups',
  TAX: 'ConfigTax'
};
export const PAYMENT_PRIVILEGES = {
  OVERVIEW: 'FrontExchangeRate',
  PAYMENT_METHODS: 'ConfigPaymentMethod',
  EXCHANGE_RATE: 'FrontExchangeRate',
  COMPANY_DATABASE: 'FrontCompanyDatabase',
  CASHIER: 'FrontCashier'
};