export interface Wallet {
    code?: string;
    user_id: number;
    currency: string;
    balance?: number;
    is_default?: number;
}