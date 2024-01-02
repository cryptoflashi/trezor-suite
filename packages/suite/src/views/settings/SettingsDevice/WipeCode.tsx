import { analytics, EventType } from '@trezor/suite-analytics';
import { useSelector } from 'react-redux';

import { HELP_CENTER_WIPE_CODE_URL } from '@trezor/urls';
import { changeWipeCode } from 'src/actions/settings/deviceSettingsActions';
import {
    ActionButton,
    ActionColumn,
    SectionItem,
    TextColumn,
    Translation,
} from 'src/components/suite';
import { SettingsAnchor } from 'src/constants/suite/anchors';
import { useDispatch } from 'src/hooks/suite';
import { useAnchor } from 'src/hooks/suite/useAnchor';
import { selectIsDeviceProtectedByWipeCode } from '@suite-common/wallet-core';

interface Props {
    isDeviceLocked: boolean;
}

export const WipeCode = ({ isDeviceLocked }: Props) => {
    const dispatch = useDispatch();
    const { anchorRef, shouldHighlight } = useAnchor(SettingsAnchor.WipeCode);
    const isDeviceProtectedByWipeCode = useSelector(selectIsDeviceProtectedByWipeCode);

    const enableWipeCode = () => {
        dispatch(changeWipeCode({ remove: false }));
        if (!isDeviceProtectedByWipeCode) {
            analytics.report({
                type: EventType.SettingsDeviceSetupWipeCode,
            });
        } else {
            analytics.report({
                type: EventType.SettingsDeviceChangeWipeCode,
            });
        }
    };

    const disableWipeCode = () => {
        dispatch(changeWipeCode({ remove: true }));
        analytics.report({
            type: EventType.SettingsDeviceDisableWipeCode,
        });
    };

    return (
        <SectionItem
            data-test="@settings/device/change-wipe-code"
            ref={anchorRef}
            shouldHighlight={shouldHighlight}
        >
            <TextColumn
                title={<Translation id="TR_DEVICE_SETTINGS_WIPE_CODE_TITLE" />}
                description={<Translation id="TR_DEVICE_SETTINGS_WIPE_CODE_DESC" />}
                buttonLink={HELP_CENTER_WIPE_CODE_URL}
            />
            {!isDeviceProtectedByWipeCode && (
                <ActionColumn>
                    <ActionButton
                        onClick={enableWipeCode}
                        isDisabled={isDeviceLocked}
                        variant="danger"
                    >
                        <Translation id="TR_SETUP_WIPE_CODE" />
                    </ActionButton>
                </ActionColumn>
            )}
            {isDeviceProtectedByWipeCode && (
                <ActionColumn>
                    <ActionButton
                        onClick={enableWipeCode}
                        isDisabled={isDeviceLocked}
                        variant="danger"
                    >
                        <Translation id="TR_CHANGE_WIPE_CODE" />
                    </ActionButton>
                    <ActionButton
                        onClick={disableWipeCode}
                        isDisabled={isDeviceLocked}
                        variant="danger"
                    >
                        <Translation id="TR_REMOVE_WIPE_CODE" />
                    </ActionButton>
                </ActionColumn>
            )}
        </SectionItem>
    );
};
