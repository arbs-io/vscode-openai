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
    const uri = Uri.parse(baseUrl)
    this._requestOptions = {
      hostname: uri.authority,
      method: method,
      path: `${uri.path}?${uri.query}`,
      port: 443,
      headers: {
        Accept: 'application/json;odata=verbose',
        'api-key': apiKey,
        'Content-Type': 'application/json;odata=verbose',
      },
    }
  }
  public async send(data?: any): Promise<any> {
    let result = ''
    const promise = new Promise((resolve, reject) => {
      const req: ClientRequest = http.request(this._requestOptions, (res) => {
        //console.log('statusCode:', res.statusCode)
        //console.log('headers:', res.headers)

        res.on('data', (chunk) => {
          result += chunk
        })

        res.on('error', (err) => {
          // console.log(err)
          reject(err)
        })

        res.on('end', () => {
          try {
            let body = result
            //there are empty responses

            if (res.statusCode === 200) {
              body = JSON.parse(result)
            }

            // console.log(res.statusCode, result)

            resolve(body)
          } catch (err) {
            // console.log(err)
            reject(err)
          }
        })
      })

      /***
       * handles the errors on the request
       */
      req.on('error', (err) => {
        // console.log(err)
        reject(err)
      })

      /***
       * handles the timeout error
       */
      req.on('timeout', (err: any) => {
        // console.log(err)
        req.abort()
      })

      /***
       * unhandle errors on the request
       */
      req.on('uncaughtException', (err) => {
        // console.log(err)
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
        console.log('request ends')
      })
    })

    return promise
  }
}
