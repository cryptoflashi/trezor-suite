import { NetworkSymbol } from '@suite-common/wallet-config';
import { useSelector } from 'src/hooks/suite/useSelector';

export const useExplorerTxUrl = (symbol: NetworkSymbol) =>
    useSelector(state => state.wallet.blockchain[symbol].explorer.address);
