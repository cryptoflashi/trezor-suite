import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { Translation } from '@suite-components';
import { Button, Flag, Select, variables } from '@trezor/components';
import regional from '@wallet-constants/coinmarket/regional';
import { CountryOption } from '@wallet-types/coinmarketCommonTypes';
import { useCoinmarketP2pFormContext } from '@wallet-hooks/useCoinmarketP2pForm';
import { FooterWrapper, Left, Right } from '@wallet-views/coinmarket';
import { getCountryLabelParts } from '@wallet-utils/coinmarket/coinmarketUtils';

const OptionLabel = styled.div`
    display: flex;
    align-items: center;
`;

const FlagWrapper = styled.div`
    padding-right: 10px;
`;

const LabelText = styled.div`
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.TYPE_DARK_GREY};
`;

const StyledRight = styled(Right)`
    @media screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        justify-content: flex-start;
    }
`;

const Label = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding-top: 1px;
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const StyledButton = styled(Button)`
    display: flex;
    min-width: 200px;
    margin-top: 0;
    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        margin-top: 20px;
        width: 100%;
    }
`;

const StyledSelect = styled(Select)`
    width: max-content;
`;

export const Footer = () => {
    const { errors, control, formState, watch, defaultCountry, p2pInfo } =
        useCoinmarketP2pFormContext();
    const countrySelect = 'countrySelect';
    const hasValues = watch('fiatInput') && !!watch('currencySelect').value;
    // used instead of formState.isValid, which is sometimes returning false even if there are no errors
    const formIsValid = Object.keys(errors).length === 0;

    return (
        <FooterWrapper>
            <Left>
                <Label>
                    <Translation id="TR_P2P_OFFERS_FOR" />
                </Label>
                <Controller
                    control={control}
                    defaultValue={defaultCountry}
                    name={countrySelect}
                    render={({ onChange, value }) => (
                        <StyledSelect
                            options={regional.countriesOptions.filter(
                                c =>
                                    c.value === regional.unknownCountry ||
                                    p2pInfo?.supportedCountries.has(c.value),
                            )}
                            isSearchable
                            value={value}
                            formatOptionLabel={(option: CountryOption) => {
                                const labelParts = getCountryLabelParts(option.label);
                                if (!labelParts) return null;

                                return (
                                    <OptionLabel>
                                        <FlagWrapper>
                                            <Flag country={option.value} />
                                        </FlagWrapper>
                                        <LabelText>{labelParts.text}</LabelText>
                                    </OptionLabel>
                                );
                            }}
                            isClearable={false}
                            minWidth="160px"
                            isClean
                            hideTextCursor
                            onChange={(selected: any) => {
                                onChange(selected);
                            }}
                        />
                    )}
                />
            </Left>
            <StyledRight>
                <StyledButton
                    isDisabled={!(formIsValid && hasValues) || formState.isSubmitting}
                    isLoading={formState.isSubmitting}
                    type="submit"
                    data-test="@coinmarket/p2p/compare-button"
                >
                    <Translation id="TR_P2P_SHOW_OFFERS" />
                </StyledButton>
            </StyledRight>
        </FooterWrapper>
    );
};
