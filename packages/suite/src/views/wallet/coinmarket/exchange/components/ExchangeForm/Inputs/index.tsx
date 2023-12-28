import { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import BigNumber from 'bignumber.js';

import { isZero, amountToSatoshi } from '@suite-common/wallet-utils';
import { useCoinmarketExchangeFormContext } from 'src/hooks/wallet/useCoinmarketExchangeForm';
import SendCryptoInput from './SendCryptoInput';
import FiatInput from './FiatInput';
import ReceiveCryptoSelect from './ReceiveCryptoSelect';
import { CoinmarketFractionButtons } from 'src/views/wallet/coinmarket/common';
import { CRYPTO_INPUT, FIAT_INPUT } from 'src/types/wallet/coinmarketExchangeForm';
import { useLayoutSize } from 'src/hooks/suite';
import { Wrapper, Left, Middle, Right, StyledIcon } from 'src/views/wallet/coinmarket';
import { useBitcoinAmountUnit } from 'src/hooks/wallet/useBitcoinAmountUnit';
import { FiatValue, FormattedCryptoAmount, Translation } from 'src/components/suite';
import { variables } from '@trezor/components';

const Row = styled.div<{ spaceBefore?: boolean }>`
    display: flex;
    align-items: flex-start;
    width: 100%;

    ${({ spaceBefore }) =>
        spaceBefore &&
        css`
            margin-top: 24px;
        `}
`;

const Balance = styled.div`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const StyledFiatValue = styled(FiatValue)`
    margin-left: 1ch;
`;

const Inputs = () => {
    const {
        trigger,
        amountLimits,
        account,
        getValues,
        composeRequest,
        network,
        setValue,
        updateFiatValue,
        clearErrors,
    } = useCoinmarketExchangeFormContext();
    const { shouldSendInSats } = useBitcoinAmountUnit(account.symbol);

    const { outputs } = getValues();
    const tokenAddress = outputs?.[0]?.token;
    const tokenData = account.tokens?.find(t => t.contract === tokenAddress);

    // Trigger validation once amountLimits are loaded after first submit
    useEffect(() => {
        trigger([CRYPTO_INPUT]);
    }, [amountLimits, trigger]);

    const { layoutSize } = useLayoutSize();

    const setRatioAmount = useCallback(
        (divisor: number) => {
            setValue('setMaxOutputId', undefined, { shouldDirty: true });
            const amount = tokenData
                ? new BigNumber(tokenData.balance || '0')
                      .dividedBy(divisor)
                      .decimalPlaces(tokenData.decimals)
                      .toString()
                : new BigNumber(account.formattedBalance)
                      .dividedBy(divisor)
                      .decimalPlaces(network.decimals)
                      .toString();
            const cryptoInputValue = shouldSendInSats
                ? amountToSatoshi(amount, network.decimals)
                : amount;
            setValue(CRYPTO_INPUT, cryptoInputValue, { shouldDirty: true });
            updateFiatValue(cryptoInputValue);
            clearErrors([FIAT_INPUT, CRYPTO_INPUT]);
            composeRequest();
        },
        [
            account.formattedBalance,
            shouldSendInSats,
            clearErrors,
            composeRequest,
            network.decimals,
            setValue,
            tokenData,
            updateFiatValue,
        ],
    );

    const setAllAmount = useCallback(() => {
        setValue(CRYPTO_INPUT, '', { shouldDirty: true });
        setValue('setMaxOutputId', 0, { shouldDirty: true });
        clearErrors([FIAT_INPUT, CRYPTO_INPUT]);
        composeRequest();
    }, [clearErrors, composeRequest, setValue]);

    const balance = tokenData ? tokenData.balance || '0' : account.formattedBalance;
    const symbol = tokenData?.symbol ?? account.symbol;
    const isBalanceZero = isZero(balance);

    return (
        <Wrapper responsiveSize="XL">
            <Row>
                <SendCryptoInput />
                {!tokenData && <FiatInput />}
            </Row>
            <Row>
                <Left>
                    <Balance>
                        <Translation id="TR_BALANCE" />:{' '}
                        <FormattedCryptoAmount value={balance} symbol={symbol} />
                        <StyledFiatValue
                            amount={balance}
                            symbol={symbol}
                            showApproximationIndicator
                        />
                    </Balance>
                </Left>
                <Right>
                    <CoinmarketFractionButtons
                        disabled={isBalanceZero}
                        onFractionClick={setRatioAmount}
                        onAllClick={setAllAmount}
                        data-test="@coinmarket/exchange/fiat-input"
                    />
                </Right>
            </Row>
            <Row spaceBefore>
                <ReceiveCryptoSelect />
            </Row>
        </Wrapper>
    );
};

export default Inputs;
