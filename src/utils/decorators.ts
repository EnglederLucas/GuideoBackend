import { $Log } from './logger';

export function Deprecated(alternate: string = ''): ClassDecorator {
    return target => {
        $Log.logger.warn(`${target.name} is deprecated and will be removed in future versions of the app.`);
        if (alternate !== '') {
            $Log.logger.warn(`Use ${alternate} instead`);
        }
    };
}

export function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}