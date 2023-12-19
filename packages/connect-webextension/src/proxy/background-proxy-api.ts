let _settings: any;
const broadcast = new BroadcastChannel('connect-explorer');
broadcast.onmessage = (event: any) => {
    const { data } = event;
    const { method, args, id } = data;

    if (method === 'init') {
        const { settings } = args[0];
        // TODO: use the provided settings in init.
        console.log('settings', settings);
        // @ts-expect-error
        TrezorConnect.init({
            manifest: {
                email: 'test@webextension.com',
                appUrl: 'http://localhost:8088',
            },
            transports: ['BridgeTransport', 'WebUsbTransport'],
            connectSrc: 'http://localhost:8088/',
        }).then((response: any) => {
            broadcast.postMessage({
                id,
                payload: response,
            });
        });
        return;
    }

    // @ts-expect-error
    TrezorConnect[method](...args).then((response: any) => {
        console.log('res', response);
        broadcast.postMessage({
            id,
            payload: response,
        });
    });
};
