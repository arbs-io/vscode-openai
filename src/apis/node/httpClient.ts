import { SettingConfig as settingCfg } from '@app/services'
import { ClientRequest } from 'http'
import http = require('https')
import { Uri } from 'vscode'

/**
 * https request class in typesript to show how to manage errors and events
 * to help prevent ECONNRESET errors
 */
export class HttpRequest {
  private _requestOptions: http.RequestOptions = {}
  constructor(method: string, apiKey: string, baseUrl: string) {
    const headers = settingCfg.apiHeaders
    const uri = Uri.parse(baseUrl)
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
    }
  }
  public async send(data?: any): Promise<any> {
    let result = ''
    const promise = new Promise((resolve, reject) => {
      const req: ClientRequest = http.request(this._requestOptions, (res) => {
        res.on('data', (chunk) => {
          result += chunk
        })

        res.on('error', (_err) => {
          reject(new Error('Network send'))
        })

        res.on('end', () => {
          try {
            let body = result
            //there are empty responses

            if (res.statusCode === 200) {
              body = JSON.parse(result)
            }

            resolve(body)
          } catch (err) {
            reject(new Error('parse failure'))
          }
        })
      })

      /***
       * handles the errors on the request
       */
      req.on('error', (_err) => {
        reject(new Error('errors on the request'))
      })

      /***
       * handles the timeout error
       */
      req.on('timeout', (_err: any) => {
        req.abort()
      })

      /***
       * unhandle errors on the request
       */
      req.on('uncaughtException', () => {
        req.abort()
      })

      /**
       * adds the payload/body
       */
      if (data) {
        const body = JSON.stringify(data)
        req.write(body)
      }

      /**
       * end the request to prevent ECONNRESETand socket hung errors
       */
      req.end(() => {
        // createDebugNotification(`HttpRequest: ${req.method}::${req.host}`)
      })
    })

    return promise
  }
}
