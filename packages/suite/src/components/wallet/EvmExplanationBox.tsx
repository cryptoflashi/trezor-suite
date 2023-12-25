import { NetworkSymbol } from '@suite-common/wallet-config';
import { CoinLogo, variables } from '@trezor/components';
import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

const EvmExplanationBoxWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 18px;
    gap: 18px;
    background: ${({ theme }) => theme.BG_GREY};
    border-radius: 8px;

    &:before {
        position: absolute;
        content: '';
        width: 0px;
        height: 0px;
        top: -9px;
        left: 14px;
        border-bottom: 10px solid ${({ theme }) => theme.BG_GREY};
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
    }
`;

const EvmExplanationBoxDescription = styled.div`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: 500;
    line-height: 18px;
`;

export interface EvmExplanationBoxProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    symbol: NetworkSymbol;
}

export const EvmExplanationBox = forwardRef<HTMLDivElement, EvmExplanationBoxProps>(
    ({ children, symbol, ...rest }, ref) => (
        <EvmExplanationBoxWrapper ref={ref} {...rest}>
            <CoinLogo symbol={symbol} />
            <EvmExplanationBoxDescription>{children}</EvmExplanationBoxDescription>
        </EvmExplanationBoxWrapper>
    ),
);
