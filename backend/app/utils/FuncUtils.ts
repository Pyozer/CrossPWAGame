/* eslint-disable @typescript-eslint/no-explicit-any */
export const isNotNull = (...values: any[]): boolean => {
    for (const value of values) {
        if (value === undefined || value === null) {
            return false;
        }
    }
    return true;
};

export const isNull = (...values: any[]): boolean => !isNotNull(...values);

export const isNotEmpty = (value: any[] | string): boolean => {
    return isNotNull(value) && value.length > 0;
};

export const isEmpty = (value: any[] | string): boolean => {
    return isNull(value) || value.length === 0;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function end<T>(array: T[]): T {
    return isEmpty(array) ? null : array[array.length - 1];
}
