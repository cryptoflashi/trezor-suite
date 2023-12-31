import { useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';
import type { Action, ThunkAction, Dispatch } from '@suite-types';

export const useActions = <M extends ActionCreatorsMapObject<Action | ThunkAction>>(actions: M) => {
    const dispatch = useDispatch<Dispatch>();
    const ref = useRef(actions);
    return useMemo(() => bindActionCreators(ref.current, dispatch), [dispatch, ref]);
};
