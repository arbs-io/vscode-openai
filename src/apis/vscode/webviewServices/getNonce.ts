import CryptoJS from 'crypto-js'

/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
export function getNonce(): string {
  const nonce = CryptoJS.lib.WordArray.random(32).toString()
  return nonce
}
