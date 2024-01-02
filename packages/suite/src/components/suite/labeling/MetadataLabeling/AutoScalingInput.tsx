import React, { useRef, useEffect, forwardRef } from 'react';

type Props = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & { minWidth: number };

export const AutoScalingInput = forwardRef<HTMLInputElement, Props>(
    ({ value, minWidth, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            if (inputRef?.current?.style) {
                inputRef.current.style.width = `${minWidth}px`;
                inputRef.current.style.width = `${inputRef.current.scrollWidth ?? minWidth}px`;
                console.log('!!! ', inputRef.current.style.width);
            }
            console.log('effect');
        }, [value, minWidth]);

        return (
            <input
                {...props}
                ref={e => {
                    if (ref && typeof ref === 'object') {
                        ref.current = e;
                        console.log('object');
                    }
                    if (ref && typeof ref === 'function') {
                        ref(e);
                        console.log('function');
                    }

                    inputRef.current = e;
                }}
                type="text"
                value={value}
                onChange={event => {
                    const { target } = event;
                    target.style.width = `${minWidth}px`;
                    target.style.width = `${target.scrollWidth}px`;
                    props.onChange?.(event);
                    console.log('change', `${target.scrollWidth}px`);
                }}
            />
        );
    },
);
