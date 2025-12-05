/**
 * Wraps a promise to log a message if the promise takes longer than a specified duration.
 * @param {Promise<T>} promise The original promise to execute.
 * @param {Function} callback Function to run when loading takes too long.
 * @param {number} delayMs The time in milliseconds before the loading message is shown.
 * @returns {Promise<T>} A new promise that resolves with the original promise's value.
 * @template T
 */
export function showDelayedLoadingMessage(promise, callback, delayMs = 100) {
    // This variable will hold the ID of the setTimeout call.
    let timerId;

    // 1. Set the timeout to log the loading message
    timerId = setTimeout(callback, delayMs);

    // 2. Wrap the original promise
    return promise.finally(() => {
        // 3. Clear the timeout regardless of whether the promise succeeded or failed.
        // This prevents the loading message from showing if the promise resolves quickly.
        clearTimeout(timerId);
    });
}