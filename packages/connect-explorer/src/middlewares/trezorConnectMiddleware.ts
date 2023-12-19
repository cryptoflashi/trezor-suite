import { MiddlewareAPI } from 'redux';

import { Dispatch, AppState, Action } from '../types';
import { getQueryVariable } from '../utils/windowUtils';
import { ON_LOCATION_CHANGE } from '../actions';
import { init } from '../actions/trezorConnectActions';

export const trezorConnectMiddleware =
    (api: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (action: Action) => {
        const prevConnectOptions = api.getState().connect.options;
        console.log('prevConnectOptions', prevConnectOptions);

        next(action);

        if (action.type === ON_LOCATION_CHANGE && !prevConnectOptions) {
            console.log('Location changed!!!');
            // const connectSrc = getQueryVariable('src');
            const connectSrc = 'http://localhost:8088';
            const options = {};
            if (connectSrc) {
                Object.assign(options, { connectSrc });
            }
            api.dispatch(init(options));
        }
    };
