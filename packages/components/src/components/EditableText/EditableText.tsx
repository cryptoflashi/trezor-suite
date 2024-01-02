import { useState, useRef, useCallback, useEffect } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { Icon } from '../assets/Icon/Icon';

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

const Editable = styled.input<{
    value?: string;
    isButton?: boolean;
    touched: boolean;
}>`
    padding-left: 1px;
    margin-right: 1px;
    text-align: left;
    cursor: text;
    border: none;
    outline: none;
    padding: 2px 5px;
    margin: 0;
    background-color: transparent;

    ${({ value }) =>
        value &&
        css`
            position: unset;
        `}

    ${({ value, isButton }) =>
        !value &&
        css`
            left: ${isButton ? '22px' : '0px'};
            right: 0;
            /* position: absolute; */
        `}

    color: ${({ touched, theme }) => (!touched ? theme.TYPE_LIGHT_GREY : 'inherit')};
`;

export interface EditableTextProps {
    originalValue?: string;
    defaultVisibleValue: string | undefined;
    onSubmit: (value: string | undefined) => void;
    onBlur: () => void;
    isButton?: boolean;
    className?: string;
}

export const EditableText = ({ onSubmit, onBlur, ...props }: EditableTextProps) => {
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
            // divRef.current?.focus();
            divRef.current?.select();
        }
    }, [value, touched]);

    return (
        <>
            <Editable
                ref={divRef}
                data-test="@metadata/input"
                touched={touched}
                value={value}
                isButton={props.isButton}
                className={props.className}
                onChange={event => {
                    setTouched(true);
                    setValue(event.target.value);
                }}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        submit(value);
                    }
                }}
            />

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
                        color={theme.iconPrimaryDefault}
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
