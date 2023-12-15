/**
 * Bridge runner
 */
import { app } from '../typed-electron';
// import { b2t } from '../libs/utils';
import { TrezordNode } from '@trezor/transport/lib/bridge/http';

import type { Module, Dependencies } from './index';

export const SERVICE_NAME = 'bridge-node';

const bridge = new TrezordNode({ port: 21325 });

const start = async () => {
    await bridge.start();
};

const load = async ({}: Dependencies) => {
    const { logger } = global;

    app.on('before-quit', () => {
        logger.info(SERVICE_NAME, 'Stopping (app quit)');
        bridge.stop();
    });

    // ipcMain.handle('bridge/toggle', async (_: unknown) => {
    //     // todo:
    // });

    // ipcMain.handle('bridge/get-status', async () => {
    //     //    todo:
    // });

    // if (!store.getBridgeSettings().startOnStartup) {
    //     return;
    // }

    try {
        // logger.info(SERVICE_NAME, `Starting (Dev: ${b2t(bridgeDev)})`);
        await start();
    } catch (err) {
        logger.error(SERVICE_NAME, `Start failed: ${err.message}`);
    }
};

export const init: Module = dependencies => {
    let loaded = false;
    return () => {
        if (loaded) return;
        loaded = true;
        load(dependencies);
    };
};
