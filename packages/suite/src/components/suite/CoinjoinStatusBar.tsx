import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Button, variables } from '@trezor/components';
import { selectAccountByKey } from '@suite-common/wallet-core';
import { WalletParams } from '@suite-common/wallet-types';
import { CoinjoinSession } from '@wallet-types/coinjoin';
import { ROUND_PHASE_MESSAGES } from '@suite-constants/coinjoin';
import { selectDevice } from '@suite-actions/suiteActions';
import { goto } from '@suite-actions/routerActions';
import { useSelector } from '@suite-hooks/useSelector';
import { STATUS as DiscoveryStatus } from '@wallet-actions/constants/discoveryConstants';
import { getPhaseTimerFormat } from '@wallet-utils/coinjoinUtils';
import { selectRouterParams } from '@suite-reducers/routerReducer';
import { CountdownTimer } from './CountdownTimer';
import { WalletLabeling } from './Labeling';
import { ProgressPie } from './ProgressPie';
import { Translation } from './Translation';
import { selectSessionProgressByAccountKey } from '@wallet-reducers/coinjoinReducer';

const SPACING = 6;

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 ${SPACING}px;
    background: ${({ theme }) => theme.BG_WHITE};
    border-bottom: 1px solid ${({ theme }) => theme.STROKE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const StyledProgressPie = styled(ProgressPie)`
    margin-right: ${SPACING}px;
`;

const StatusText = styled.span`
    color: ${({ theme }) => theme.TYPE_GREEN};
`;

const Note = styled.span`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
`;

const Separator = styled.span`
    margin: 0 ${SPACING / 2}px;
`;

const ViewButton = styled(Button)`
    height: 20px;
    margin-left: auto;
`;

interface CoinjoinStatusBarProps {
    accountKey: string;
    session: CoinjoinSession;
    isSingle: boolean;
}

export const CoinjoinStatusBar = ({ accountKey, session, isSingle }: CoinjoinStatusBarProps) => {
    const devices = useSelector(state => state.devices);
    const relatedAccount = useSelector(state => selectAccountByKey(state, accountKey));
    const selectedDevice = useSelector(state => state.suite.device);
    const routerParams = useSelector(selectRouterParams);
    const discovery = useSelector(state => state.wallet.discovery);
    const sessionProgress = useSelector(state =>
        selectSessionProgressByAccountKey(state, accountKey),
    );
    const dispatch = useDispatch();

    if (!relatedAccount) {
        return null;
    }

    const { symbol, index, accountType, deviceState } = relatedAccount;

    const relatedDevice = devices.find(device => device.state === relatedAccount?.deviceState);
    const isOnSelectedDevice = selectedDevice?.state === deviceState;

    if (!relatedDevice) {
        return null;
    }

    const handleViewAccount = () => {
        if (!isOnSelectedDevice) {
            dispatch(selectDevice(relatedDevice));
        }

        dispatch(
            goto('wallet-index', {
                params: {
                    symbol,
                    accountIndex: index,
                    accountType,
                },
            }),
        );
    };

    const { roundPhase, signedRounds, maxRounds, roundPhaseDeadline, sessionDeadline, paused } =
        session;

    const getSessionStatusMessage = () => {
        if (paused) {
            return <Translation id="TR_PAUSED" />;
        }

        if (roundPhase === undefined) {
            return <Translation id="TR_LOOKING_FOR_COINJOIN_ROUND" />;
        }

        return <Translation id={ROUND_PHASE_MESSAGES[roundPhase]} />;
    };

    const {
        symbol: symbolParam,
        accountIndex: indexParam,
        accountType: accountTypeParam,
    } = (routerParams as WalletParams) || {};

    const isOnAccountPage =
        symbolParam === symbol && indexParam === index && accountTypeParam === accountType;

    const areDevicesDiscovered = devices.every(({ state }) =>
        discovery.find(
            discoveryState =>
                discoveryState.deviceState === state &&
                discoveryState.status === DiscoveryStatus.COMPLETED,
        ),
    );

    const isPastDeadline =
        !!roundPhaseDeadline && new Date(roundPhaseDeadline).getTime() <= Date.now() + 1000;

    return (
        <Container>
            <StyledProgressPie progress={sessionProgress} />

            <StatusText>
                {getSessionStatusMessage()}

                {sessionDeadline && (
                    <>
                        <Separator>•</Separator>
                        <Translation
                            id="TR_COINJOIN_ROUNDS_LEFT"
                            values={{ rounds: maxRounds - signedRounds.length }}
                        />
                    </>
                )}
            </StatusText>

            {roundPhase !== undefined && !paused && roundPhaseDeadline && (
                <Note>
                    <Separator>•</Separator>

                    <Translation
                        id="TR_COINJOIN_ROUND_COUNTDOWN"
                        values={{
                            time: isPastDeadline ? (
                                <Translation id="TR_COINJOIN_ROUND_COUNTDOWN_OVERTIME" />
                            ) : (
                                <CountdownTimer
                                    isApproximate
                                    deadline={roundPhaseDeadline}
                                    format={getPhaseTimerFormat(roundPhaseDeadline)}
                                />
                            ),
                        }}
                    />
                </Note>
            )}

            {!isSingle && (
                <Note>
                    <Separator>•</Separator>
                    <WalletLabeling device={relatedDevice} shouldUseDeviceLabel />
                </Note>
            )}

            {((isOnSelectedDevice && !isOnAccountPage) ||
                (!isOnSelectedDevice && areDevicesDiscovered)) && (
                <ViewButton variant="tertiary" onClick={handleViewAccount}>
                    <Translation id="TR_VIEW" />
                </ViewButton>
            )}
        </Container>
    );
};
