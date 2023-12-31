import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { Input, InputProps, variables } from '@trezor/components';

const LevelContainer = styled.div`
    position: absolute;
    right: 20px;
    width: 68px;

    ${Input.InputAddon} {
        font-size: ${variables.FONT_SIZE.SMALL};
        font-weight: ${variables.FONT_WEIGHT.MEDIUM};
        color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
        pointer-events: none;
    }
`;

const Level = styled(Input)`
    height: 42px;
    padding: ${({ innerAddon }) => !innerAddon && '1px 12px 0 12px'};
    border: 1.5px solid ${({ theme }) => theme.STROKE_GREY};
    color: ${({ theme }) => theme.TYPE_GREEN};
    font-size: ${variables.FONT_SIZE.H2};
    text-align: center;

    :disabled {
        color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
        background: ${({ theme }) => theme.BG_LIGHT_RED};
    }
`;

const MAX_ALLOWED_INTEGER = 1000000;

interface SliderInputProps extends Pick<InputProps, 'isDisabled' | 'innerAddon' | 'addonAlign'> {
    value: number | '';
    onChange: (number: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export const SliderInput = forwardRef<
    { setPreviousValue: (number: number) => void },
    SliderInputProps
>(({ value, onChange, min = 1, max = 100, className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<number | ''>(value);

    const inputRef = useRef<HTMLInputElement>(null);
    const previousValue = useRef(inputValue);

    useImperativeHandle(
        ref,
        () => ({
            setPreviousValue(number) {
                previousValue.current = number;
            },
        }),
        [],
    );

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        if (target.value === '') {
            setInputValue('');

            return;
        }

        const number = Number(target.value);
        if (Number.isNaN(number) || number > MAX_ALLOWED_INTEGER) {
            return;
        }

        previousValue.current = number;
        setInputValue(number);
    };

    const handleFocus = () => {
        setInputValue('');
    };

    const handleBlur = () => {
        let formattedNumber = Number(inputValue);

        if (!formattedNumber && previousValue.current !== '') {
            formattedNumber = previousValue.current;
        }

        if (formattedNumber < min) {
            formattedNumber = min;
        }

        if (formattedNumber > max) {
            formattedNumber = max;
        }

        setInputValue(formattedNumber);
        onChange(formattedNumber);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            inputRef.current?.blur();
        }
    };

    return (
        <LevelContainer className={className}>
            <Level
                noError
                noTopLabel
                value={String(inputValue)}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                innerRef={inputRef}
                {...props}
            />
        </LevelContainer>
    );
});
