import React, { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { useAtom, atom } from 'jotai';
import { Blur, Canvas, Text as SkiaText, useFont } from '@shopify/react-native-skia';

import { Color, TypographyStyle, typographyStylesBase } from '@trezor/theme';
import { prepareNativeStyle, useNativeStyles } from '@trezor/styles';

import { Text } from './Text';
import { Box } from './Box';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const satoshiFont = require('../../../packages/theme/fonts/TTSatoshi-Regular.otf');

const isDiscreetModeOn = atom(false);
export const useDiscreetMode = () => {
    const [isDiscreetMode, setIsDiscreetMode] = useAtom(isDiscreetModeOn);
    return {
        isDiscreetMode,
        setIsDiscreetMode,
    };
};

type DiscreetCanvasProps = {
    width: number;
    height: number;
    fontSize: number;
    text: string;
    color: Color;
};
const DiscreetCanvas = ({ width, height, fontSize, text, color }: DiscreetCanvasProps) => {
    const font = useFont(satoshiFont, fontSize);
    const {
        utils: { colors },
    } = useNativeStyles();
    if (!font) return null;

    return (
        <Canvas style={{ height, width }}>
            <SkiaText x={0} y={fontSize} text={text} font={font} color={colors[color]} />
            <Blur blur={15} mode="decal" />
        </Canvas>
    );
};

const textStyle = prepareNativeStyle<{ isDiscreet: boolean }>((_, { isDiscreet }) => ({
    extend: {
        condition: isDiscreet,
        style: {
            opacity: 0,
            height: 0,
        },
    },
}));

type TextValueProps = {
    onSetWidth: (width: number) => void;
    typography?: TypographyStyle;
    color?: Color;
    isDiscreet: boolean;
    children: string;
};
const TextValue = ({ onSetWidth, typography, isDiscreet, color, children }: TextValueProps) => {
    const { applyStyle } = useNativeStyles();

    const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
        onSetWidth(nativeEvent.layout.width);
    };

    return (
        <Box>
            <Text
                variant={typography}
                color={color}
                onLayout={handleLayout}
                style={applyStyle(textStyle, { isDiscreet })}
            >
                {children}
            </Text>
        </Box>
    );
};

type DiscreetTextProps = {
    typography?: TypographyStyle;
    color?: Color;
    children?: string | null;
};
export const DiscreetText = ({
    children = '',
    color = 'gray800',
    typography = 'body',
}: DiscreetTextProps) => {
    const { isDiscreetMode } = useDiscreetMode();
    const [width, setWidth] = useState(0);

    const { lineHeight, fontSize } = typographyStylesBase[typography];

    if (!children) return null;

    return (
        <Box>
            <TextValue
                color={color}
                onSetWidth={setWidth}
                typography={typography}
                isDiscreet={isDiscreetMode}
            >
                {children}
            </TextValue>
            {isDiscreetMode && (
                <DiscreetCanvas
                    width={width}
                    height={lineHeight}
                    fontSize={fontSize}
                    text={children}
                    color={color}
                />
            )}
        </Box>
    );
};
