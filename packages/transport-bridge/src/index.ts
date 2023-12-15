import { TrezordNode } from '@trezor/transport/lib/bridge/http';

const trezordNode = new TrezordNode({ port: 21325 });

trezordNode.start();
