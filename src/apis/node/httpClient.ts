import { SettingConfig as settingCfg } from '@app/services';
import { ClientRequest } from 'http';
import * as https from 'https';
import { Uri } from 'vscode';

/**
 * https request class in TypeScript to show how to manage errors and events
 * to help prevent ECONNRESET errors
 */
export class HttpRequest {
  private _requestOptions: https.RequestOptions = {};

  constructor(method: string, apiKey: string, baseUrl: string) {
    const headers = settingCfg.apiHeaders;
    const uri = Uri.parse(baseUrl);
    this._requestOptions = {
      hostname: uri.authority,
      method: method,
      path: `${uri.path}?${uri.query}`,
      port: 443,
      headers: {
        ...headers,
        Accept: 'application/json;odata=verbose',
        'api-key': apiKey,
        Authorization: apiKey,
        'Content-Type': 'application/json;odata=verbose',
      },
    };
  }

  public async send(data?: any): Promise<any> {
    let result = '';
    const promise = new Promise((resolve, reject) => {
      const req: ClientRequest = https.request(this._requestOptions, (res) => {
        res.on('data', (chunk) => {
          result += chunk;
        });

        res.on('error', (_err) => {
          reject(new Error('Network send'));
        });

        res.on('end', () => {
          try {
            let body = result;
            // there are empty responses

            if (res.statusCode === 200) {
              body = JSON.parse(result);
            }

            resolve(body);
          } catch (err) {
            reject(new Error('parse failure'));
          }
        });
      });

      /***
       * Handles the errors on the request
       */
      req.on('error', (_err) => {
        reject(new Error('errors on the request'));
      });

      /***
       * Handles the timeout error
       */
      req.on('timeout', (_err: any) => {
        req.abort();
      });

      /***
       * Handles uncaught exceptions on the request
       */
      req.on('uncaughtException', () => {
        req.abort();
      });

      /**
       * Adds the payload/body
       */
      if (data) {
        const body = JSON.stringify(data);
        req.write(body);
      }

      /**
       * Ends the request to prevent ECONNRESET and socket hung errors
       */
      req.end(() => {
        // createDebugNotification(`HttpRequest: ${req.method}::${req.host}`)
      });
    });

    return promise;
  }
}
