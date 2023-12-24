import styled from 'styled-components';

import { variables, Card } from '@trezor/components';
import { Account } from 'src/types/wallet';
import { getMainnets } from '@suite-common/wallet-config';
import { useDispatch } from 'src/hooks/suite';
import { openModal } from 'src/actions/suite/modalActions';
import { Translation } from 'src/components/suite';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
    width: 100%;
`;

const Title = styled.div`
    color: ${({ theme }) => theme.TYPE_DARK_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: 600;
    margin-bottom: 4px;
`;

const Description = styled.span`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: 500;
    line-height: 18px;
`;

interface EvmExplanationBannerProps {
    account: Account;
}

export const EvmExplanationBanner = ({ account }: EvmExplanationBannerProps) => {
    const dispatch = useDispatch();
    const network = getMainnets().find(n => n.symbol === account.symbol);

    if (network?.networkType !== 'ethereum') {
        return null;
    }

    return (
        <Wrapper>
            <StyledCard
                largePadding
                onClick={() => {
                    // TODO: remove
                    dispatch(
                        openModal({
                            type: 'confirm-evm-explanation',
                            coin: account.symbol,
                            route: 'wallet-receive',
                        }),
                    );
                }}
            >
                <Title>
                    <Translation
                        id="TR_EVM_EXPLANATION_TITLE"
                        values={{
                            network: network.name,
                        }}
                    />
                </Title>
                <Description>
                    <Translation
                        id={
                            network.symbol === 'eth'
                                ? 'TR_EVM_EXPLANATION_DESCRIPTION_ETH'
                                : 'TR_EVM_EXPLANATION_DESCRIPTION_OTHER'
                        }
                        values={{
                            network: network.name,
                        }}
                    />
                </Description>
            </StyledCard>
        </Wrapper>
    );
};
