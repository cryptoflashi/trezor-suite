import styled from 'styled-components';

import { variables, Card } from '@trezor/components';
import { Account } from 'src/types/wallet';
import { getMainnets } from '@suite-common/wallet-config';
import { useDispatch } from 'src/hooks/suite';
import { openModal } from 'src/actions/suite/modalActions';

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

interface AccountEmptyProps {
    account: Account;
}

export const NetworkExplanation = ({ account }: AccountEmptyProps) => {
    const dispatch = useDispatch();
    const network = getMainnets().find(n => n.symbol === account.symbol);

    if (network?.networkType !== 'ethereum') {
        return null;
    }

    // TODO: translations

    return (
        <Wrapper>
            <StyledCard
                largePadding
                onClick={() => {
                    dispatch(
                        openModal({ type: 'confirm-network-explanation', coin: account.symbol }),
                    );
                }}
            >
                {network.symbol === 'eth' ? (
                    <>
                        <Title>{network.name} is its own blockchain</Title>
                        <Description>Ethereum is a standalone blockchain.</Description>
                    </>
                ) : (
                    <>
                        <Title>{network.name} is its own blockchain</Title>
                        <Description>
                            Polygon is a standalone blockchain that operates in conjunction with the
                            Ethereum network. While Polygon uses the same address format as
                            Ethereum, the coins and tokens within this network are unique to Polygon
                            and not interchangeable with other blockchains.
                        </Description>
                    </>
                )}
            </StyledCard>
        </Wrapper>
    );
};
