export const getQueryVariable = (variable: string) => {
    console.log('getQueryVariable');
    const query = window.location.hash.substring(3);
    console.log('query', query);
    const vars = query.split('&');
    console.log('vars', vars);
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
};
