import http from 'node:http'
import { extractQueryParams } from './utils/extract-query-params.js'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route) {
    if(url.includes('tasks') && (method === 'POST' || method === 'PUT')) {
      if(!req.body?.title || !req.body?.description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'The request must have a body with title and description.'
        }))
      }
    }

    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups ?? { query: '', params: {} }

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)