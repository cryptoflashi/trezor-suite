import { ReactNode, useState, useRef, useCallback, useEffect } from 'react';
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

const Placeholder = styled.div`
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
`;

const Editable = styled.input<{
    value?: string;
    isButton?: boolean;
    touched: boolean;
    isEditable: boolean;
}>`
    padding-left: 1px;
    margin-right: 1px;
    text-align: left;
    cursor: text;
    border: solid 1px ${({ isEditable }) => (isEditable ? 'gray' : 'transparent')};
    outline: none;
    padding: 2px 5px;
    border-radius: 8px;
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
    defaultVisibleValue: ReactNode;
    onSubmit: (value: string | undefined) => void;
    onBlur: () => void;
    isButton?: boolean;
}

export const EditableText = ({ onSubmit, onBlur, ...props }: EditableTextProps) => {
    const [touched, setTouched] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    // // value is used to mirror divRef.current.textContent so that its changes force react to render
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

    const handleOnTextClick = () => {
        setIsEditable(true);

        if (divRef.current) {
            console.log('____FOCUS');
            divRef.current.focus();
            divRef.current.select();
        }
    };

    useEffect(() => {
        // Set value of content editable element; set caret to correct position;

        if (!divRef?.current || touched) {
            return;
        }

        if (props.originalValue) {
            divRef.current.textContent = props.originalValue;
            setValue(props.originalValue);
        }

        divRef.current.focus();
    }, [props.originalValue, divRef, touched, setValue]);

    return (
        <>
            {/* <WrappedComponent {...props}> */}
            <Editable
                isEditable={isEditable}
                // onKeyPress={e => setValue(e.key)}
                // onKeyUp={() => {
                //     if (!divRef.current?.textContent) {
                //         setValue('');
                //     }
                // }}
                // onBlur={() => !value && onBlur()}
                // onPaste={e => setValue(e.clipboardData.getData('text/plain'))}
                ref={divRef}
                data-test="@metadata/input"
                touched={touched}
                value={value}
                isButton={props.isButton}
                onClick={handleOnTextClick}
                onChange={e => {
                    setValue(e.target.value);
                }}
                placeholder={props.defaultVisibleValue}
            />
            {/* </WrappedComponent> */}

            {isEditable && (
                <IconsWrapper>
                    <IconWrapper bgColor={theme.BG_LIGHT_GREEN}>
                        <Icon
                            useCursorPointer
                            size={14}
                            data-test="@metadata/submit"
                            icon="CHECK"
                            onClick={e => {
                                setIsEditable(false);
                                e.stopPropagation();
                                submit(divRef?.current?.textContent);
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
                                setIsEditable(false);
                                e.stopPropagation();
                                onBlur();
                            }}
                            color={theme.TYPE_DARK_GREY}
                        />
                    </IconWrapper>
                </IconsWrapper>
            )}
        </>
    );
};
