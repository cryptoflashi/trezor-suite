import {
    useEffect,
    useState,
    useCallback,
    useRef,
    FunctionComponent,
    PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import { Icon, useTheme } from '@trezor/components';
import { AutoScalingInput } from './AutoScalingInput';

const IconWrapper = styled.div<{ bgColor: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.bgColor};
    border-radius: 4px;
    margin: 0 3px;
    padding: 4px;
`;

const IconsWrapper = styled.div`
    display: flex;
`;

const Editable = styled(AutoScalingInput)`
    all: inherit;

    cursor: text;
`;

interface WithEditableProps {
    originalValue?: string;
    onSubmit: (value: string | undefined) => void;
    onBlur: () => void;
    isButton?: boolean;
}

/**
 * Takes component in parameter and wraps it with content-editable necessities. Renders contenteditable div as it's child
 * and control buttons (submit, cancel).
 */
export const withEditable =
    (WrappedComponent: FunctionComponent<PropsWithChildren>) =>
    ({ onSubmit, onBlur, ...props }: WithEditableProps) => {
        const [touched, setTouched] = useState(false);
        const [value, setValue] = useState('');

        const theme = useTheme();
        const divRef = useRef<HTMLInputElement>(null);

        const submit = useCallback(
            (value?: string | null) => {
                if (props.originalValue && value === props.originalValue) {
                    return onBlur();
                }

                onSubmit(value ?? '');
                onBlur();
            },
            [props, onSubmit, onBlur],
        );

        useEffect(() => {
            if (!divRef?.current || touched) {
                return;
            }

            if (props.originalValue) {
                setValue(props.originalValue);
            }
        }, [props.originalValue, divRef, touched, setValue]);

        useEffect(() => {
            if (!touched) {
                divRef.current?.select();
            }
        }, [value, touched]);

        return (
            <>
                <WrappedComponent {...props}>
                    <Editable
                        minWidth={120}
                        ref={divRef}
                        data-test="@metadata/input"
                        value={value}
                        onChange={event => {
                            setTouched(true);
                            setValue(event.target.value);
                        }}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                submit(value);
                            }
                        }}
                        placeholder="Lorem ipsum dolor set"
                    />
                </WrappedComponent>

                <IconsWrapper>
                    <IconWrapper bgColor={theme.BG_LIGHT_GREEN}>
                        <Icon
                            useCursorPointer
                            size={14}
                            data-test="@metadata/submit"
                            icon="CHECK"
                            onClick={e => {
                                e.stopPropagation();
                                submit(value);
                            }}
                            color={theme.TYPE_GREEN}
                        />
                    </IconWrapper>

                    <IconWrapper bgColor={theme.BG_GREY}>
                        <Icon
                            useCursorPointer
                            size={14}
                            data-test="@metadata/cancel"
                            icon="CROSS"
                            onClick={e => {
                                e.stopPropagation();
                                onBlur();
                            }}
                            color={theme.TYPE_DARK_GREY}
                        />
                    </IconWrapper>
                </IconsWrapper>
            </>
        );
    };
