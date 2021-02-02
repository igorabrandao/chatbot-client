export interface Transaction {
    type?: string;
    amount: number;
    converted_amount: number;
    origin_wallet?: number;
    destiny_wallet?: number;
    from_currency?: string;
    to_currency?: string;
    status?: number;
}