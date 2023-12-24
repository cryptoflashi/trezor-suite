import styled from 'styled-components';

import { Translation, Modal } from 'src/components/suite';
import { useDispatch } from 'src/hooks/suite';
import { Button, CoinLogo, H3, Image, variables } from '@trezor/components';
import { onCancel } from 'src/actions/suite/modalActions';
import { Account } from '@suite-common/wallet-types';
import { getMainnets } from '@suite-common/wallet-config';
import { Route } from '@suite-common/suite-types';
import { TranslationKey } from 'src/components/suite/Translation';

const StyledImage = styled(Image)`
    width: 100%;
    height: 100%;
    align-self: center;
`;

const StyledModal = styled(Modal)`
    width: 390px;
`;

const StyledButton = styled(Button)`
    flex-grow: 1;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled(H3)`
    margin-bottom: 8px;
    text-align: left;
`;

const Description = styled.span`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: 500;
    line-height: 20px;
    text-align: left;
`;

const ImageWrapper = styled.div`
    position: relative;
    margin-bottom: 32px;
`;

const ImageCoinLogoCommon = styled(CoinLogo)`
    position: absolute;

    div {
        height: 100%;
    }

    svg {
        width: 100%;
        height: 100%;
    }
`;

const ImageCoinLogoLeft = styled(ImageCoinLogoCommon)`
    top: 17%;
    left: 3.5%;
    height: 52%;
`;

const ImageCoinLogoRight = styled(ImageCoinLogoCommon)`
    top: 31%;
    right: 3.5%;
    height: 52%;
`;

export interface ConfirmNetworkExplanationModalProps {
    coin: Account['symbol'];
    route: 'wallet-receive' | 'wallet-send';
}

export const ConfirmEvmExplanationModal = ({
    coin,
    route,
}: ConfirmNetworkExplanationModalProps) => {
    const dispatch = useDispatch();
    const close = () => dispatch(onCancel());

    const network = getMainnets().find(n => n.symbol === coin);

    if (!network) {
        return null;
    }

    const descriptionTranslationsIds: Record<typeof route, TranslationKey> = {
        'wallet-receive': 'TR_CONFIRM_EVM_EXPLANATION_RECEIVE_DESCRIPTION',
        'wallet-send': 'TR_CONFIRM_EVM_EXPLANATION_SEND_DESCRIPTION',
    };

    return (
        <StyledModal
            headerComponent={null}
            bottomBar={
                <StyledButton variant="primary" onClick={close}>
                    <Translation id="TR_CONFIRM" />
                </StyledButton>
            }
        >
            <Content>
                <ImageWrapper>
                    <StyledImage image="CONFIRM_EVM_EXPLANATION" />
                    <ImageCoinLogoLeft symbol={network.symbol} />
                    <ImageCoinLogoRight symbol="eth" />
                </ImageWrapper>
                <Title>
                    <Translation
                        id="TR_CONFIRM_EVM_EXPLANATION_TITLE"
                        values={{
                            network: network.name,
                        }}
                    />
                </Title>
                <Description>
                    <Translation
                        id={descriptionTranslationsIds[route]}
                        values={{
                            network: network.name,
                        }}
                    />
                </Description>
            </Content>
        </StyledModal>
    );
};
