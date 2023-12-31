import React from 'react';

import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';
import { Box, IconButton, useDiscreetMode, Text } from '@suite-native/atoms';

const headerStyle = prepareNativeStyle(() => ({
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
}));

const iconStyle = prepareNativeStyle(() => ({
    position: 'absolute',
    right: 0,
}));

export const DashboardHeader = () => {
    const { applyStyle } = useNativeStyles();
    const { isDiscreetMode, setIsDiscreetMode } = useDiscreetMode();
    return (
        <Box style={applyStyle(headerStyle)}>
            <Text>Home</Text>
            <IconButton
                onPress={() => setIsDiscreetMode(!isDiscreetMode)}
                iconName={isDiscreetMode ? 'eyeglasses' : 'eyeSlash'}
                colorScheme="gray"
                size="large"
                style={applyStyle(iconStyle)}
                isRounded
            />
        </Box>
    );
};
