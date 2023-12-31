import reducer, { initialState } from '@wallet-reducers/cardanoStakingReducer';
import { CARDANO_STAKING } from '@wallet-actions/constants';

describe('cardanoStakingReducer reducer', () => {
    it('test initial state', () => {
        expect(
            reducer(undefined, {
                // @ts-expect-error
                type: 'none',
            }),
        ).toEqual(initialState);
    });

    it('CARDANO_STAKING.ADD_PENDING_STAKE_TX', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.ADD_PENDING_STAKE_TX,
                pendingStakeTx: {
                    accountKey: 'key',
                    txid: 'txxid',
                    blockHeight: 1,
                },
            } as any),
        ).toEqual({
            mainnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [
                {
                    accountKey: 'key',
                    blockHeight: 1,
                    txid: 'txxid',
                },
            ],
        });
    });

    it('CARDANO_STAKING.REMOVE_PENDING_STAKE_TX', () => {
        expect(
            reducer(
                {
                    pendingTx: [
                        {
                            accountKey: 'key',
                            ts: 1,
                            txid: 'txxid',
                        },
                    ],
                    mainnet: {
                        trezorPools: {
                            pools: [],
                            next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                        },
                        isFetchError: false,
                        isFetchLoading: false,
                    },
                    testnet: {
                        trezorPools: {
                            pools: [],
                            next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                        },
                        isFetchError: false,
                        isFetchLoading: false,
                    },
                },
                {
                    type: CARDANO_STAKING.REMOVE_PENDING_STAKE_TX,
                    accountKey: 'key',
                } as any,
            ),
        ).toEqual({
            pendingTx: [],
            mainnet: {
                trezorPools: {
                    pools: [],
                    next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                },
                isFetchError: false,
                isFetchLoading: false,
            },
            testnet: {
                trezorPools: {
                    pools: [],
                    next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                },
                isFetchError: false,
                isFetchLoading: false,
            },
        });
    });

    it('CARDANO_STAKING.SET_FETCH_LOADING mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_LOADING,
                loading: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: true,
            },
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_LOADING testnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_LOADING,
                loading: true,
                network: 'testnet',
            } as any),
        ).toEqual({
            mainnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: true,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_ERROR mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_ERROR,
                error: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                trezorPools: undefined,
                isFetchError: true,
                isFetchLoading: false,
            },
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_ERROR mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_ERROR,
                error: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                trezorPools: undefined,
                isFetchError: true,
                isFetchLoading: false,
            },
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_TREZOR_POOLS mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_TREZOR_POOLS,
                network: 'mainnet',
                trezorPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
            } as any),
        ).toEqual({
            pendingTx: [],
            testnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            mainnet: {
                trezorPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
                isFetchError: false,
                isFetchLoading: false,
            },
        });
    });

    it('CARDANO_STAKING.SET_TREZOR_POOLS testnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_TREZOR_POOLS,
                network: 'testnet',
                trezorPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
            } as any),
        ).toEqual({
            testnet: {
                trezorPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
                isFetchError: false,
                isFetchLoading: false,
            },
            mainnet: {
                trezorPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });
});
