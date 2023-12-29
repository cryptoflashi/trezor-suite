import { NetworkSymbol } from '@suite-common/wallet-config';
import { CryptoSymbol } from 'invity-api';

const suiteToCryptoSymbols: Partial<Record<NetworkSymbol, CryptoSymbol>> = {
    btc: 'BTC',
    ltc: 'LTC',
    eth: 'ETH',
    etc: 'ETC',
    xrp: 'XRP',
    bch: 'BCH',
    btg: 'BTG',
    dash: 'DASH',
    dgb: 'DGB',
    doge: 'DOGE',
    zec: 'ZEC',
    test: 'TEST',
    ada: 'ADA',
    sol: 'SOL',
    matic: 'MATIC',
};

const cryptoToSuiteSymbols: Partial<Record<CryptoSymbol, NetworkSymbol>> = {};
Object.keys(suiteToCryptoSymbols).forEach(
    key =>
        (cryptoToSuiteSymbols[suiteToCryptoSymbols[key as NetworkSymbol] as CryptoSymbol] =
            key as NetworkSymbol),
);

export function suiteToCryptoSymbol(suiteSymbol: NetworkSymbol): CryptoSymbol | undefined {
    return suiteToCryptoSymbols[suiteSymbol];
}

export function cryptoToSuiteSymbol(cryptoSymbol: CryptoSymbol): NetworkSymbol | undefined {
    return cryptoToSuiteSymbols[cryptoSymbol];
}
