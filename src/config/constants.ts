// Configuration constants for the application

// Account value in Indian Rupees (₹)
// This can be easily changed to fetch from a database or API in the future
export const ACCOUNT_VALUE_INR = 2;

// Currency symbol
export const CURRENCY_SYMBOL = "₹";

// Format currency value
export function formatCurrency(value: number): string {
    return `${CURRENCY_SYMBOL}${value.toFixed(2)}`;
}
