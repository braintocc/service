import Logger from "../helpers/logger";

export function logErrors(err: any, _: any, __: any, next: any) {
    Logger.error(err);
    next(err);
}
