import { selectLabelingDataForAccount } from '../../reducers/suite/metadataReducer';
import { findChainedTransactions, findTransactions } from '@suite-common/wallet-utils';
import { Dispatch, GetState } from 'src/types/suite';
import * as metadataActions from 'src/actions/suite/metadataActions';
import { AccountLabels, AccountOutputLabels } from '@suite-common/metadata-types';
import { AccountKey, WalletAccountTransaction } from '@suite-common/wallet-types';

type DeleteAllOutputLabelsParams = {
    labels: AccountLabels['outputLabels']['labels'];
    dispatch: Dispatch;
    accountKey: AccountKey;
    txid: string;
};

const deleteAllOutputLabels = async ({
    labels,
    dispatch,
    accountKey,
    txid,
}: DeleteAllOutputLabelsParams) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const outputIndex of Object.keys(labels)) {
        // eslint-disable-next-line no-await-in-loop
        await dispatch(
            metadataActions.addMetadata({
                type: 'outputLabel',
                entityKey: accountKey,
                txid,
                outputIndex: Number(outputIndex),
                defaultValue: '',
                value: '',
            }),
        );
    }
};

type MoveLabelToNewTransactionParams = {
    accountOutputLabels: AccountOutputLabels;
    dispatch: Dispatch;
    accountKey: AccountKey;
    newTxid: string;
};

export const moveLabelToNewTransaction = async ({
    accountOutputLabels,
    dispatch,
    accountKey,
    newTxid,
}: MoveLabelToNewTransactionParams) => {
    // eslint-disable-next-line no-restricted-syntax,
    for (const outputIndex of Object.keys(accountOutputLabels)) {
        const value = accountOutputLabels[outputIndex];
        // eslint-disable-next-line no-await-in-loop
        await dispatch(
            metadataActions.addMetadata({
                type: 'outputLabel',
                entityKey: accountKey,
                txid: newTxid,
                outputIndex: Number(outputIndex),
                defaultValue: '',
                value,
            }),
        );
    }
};

type FindLabelsToBeMovedOrDeletedParams = {
    prevTxid: string;
    getState: GetState;
};

export type LabelsToBeMovedOrDeleted = Record<
    AccountKey,
    {
        toBeMoved: WalletAccountTransaction;
        toBeDeleted: WalletAccountTransaction[];
    }
>;

export const findLabelsToBeMovedOrDeleted = ({
    prevTxid,
    getState,
}: FindLabelsToBeMovedOrDeletedParams): LabelsToBeMovedOrDeleted => {
    const result: LabelsToBeMovedOrDeleted = {};

    const accountTransactions = findTransactions(
        prevTxid,
        getState().wallet.transactions.transactions,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const accountTransaction of accountTransactions) {
        const chainedTransactionsToDrop = findChainedTransactions(
            accountTransaction.tx.descriptor,
            accountTransaction.tx.txid,
            getState().wallet.transactions.transactions,
        );

        const allAccountsTransactionsIncludingChained: WalletAccountTransaction[] = [
            accountTransaction.tx,
            ...(chainedTransactionsToDrop?.own ?? []),
            // Intentionally using `chainedTransactionsToDrop?.others`, they will be found when we query another account in the loop
        ];

        result[accountTransaction.key] = {
            toBeDeleted: allAccountsTransactionsIncludingChained,
            toBeMoved: accountTransaction.tx,
        };
    }

    return result;
};

type MoveLabelsForRbfParams = {
    newTxid: string;
    toBeMovedOrDeletedList: LabelsToBeMovedOrDeleted;
};

export const moveLabelsForRbf =
    ({ toBeMovedOrDeletedList, newTxid }: MoveLabelsForRbfParams) =>
    async (dispatch: Dispatch, getState: GetState) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const toBeMovedOrDeleted of Object.entries(toBeMovedOrDeletedList)) {
            const [accountKey, data] = toBeMovedOrDeleted;

            const accountMetadata = selectLabelingDataForAccount(getState(), accountKey);
            const accountOutputLabelsToBeMoved: AccountOutputLabels =
                accountMetadata?.outputLabels?.[data.toBeMoved.txid] ?? {};

            // eslint-disable-next-line no-await-in-loop
            await moveLabelToNewTransaction({
                accountKey,
                accountOutputLabels: accountOutputLabelsToBeMoved,
                newTxid,
                dispatch,
            });

            // eslint-disable-next-line no-restricted-syntax
            for (const transactionToDrop of data.toBeDeleted) {
                const accountOutputLabelsToBeDeleted: AccountOutputLabels =
                    accountMetadata?.outputLabels?.[transactionToDrop.txid] ?? {};

                const deleteParams: DeleteAllOutputLabelsParams = {
                    accountKey,
                    dispatch,
                    labels: accountOutputLabelsToBeDeleted,
                    txid: transactionToDrop.txid,
                };

                // eslint-disable-next-line no-await-in-loop
                await deleteAllOutputLabels(deleteParams);
            }
        }
    };
