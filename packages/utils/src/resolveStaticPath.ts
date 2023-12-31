// TODO: related to Suite, move it to '@suite-common/suite-utils' package

export const resolveStaticPath = (
    path: string,
    pathPrefix: string | undefined = process.env.ASSET_PREFIX,
) => `${pathPrefix || ''}/static/${path.replace(/^\/+/, '')}`;
