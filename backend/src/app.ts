import express, { json, urlencoded } from 'express'
import { RegisterRoutes } from './routes'
import Authentication from 'security/Authentication'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { Logger } from '@dmtool/common'
import { ApiError, IllegalArgument } from '@dmtool/domain'

const logger = new Logger('App')
const app = express()
const authentication = new Authentication(passport)

// Use body parser to read sent json payloads
app.use(urlencoded({ extended: true }))
app.use(json({ limit: '50mb' }))
// CookieParser Middleware
app.use(cookieParser())
app.use(authentication.initialize())

RegisterRoutes(app)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err)
  const status = err.status || err.statusCode || 500
  if (err instanceof ApiError || err instanceof IllegalArgument) {
    const body: any = {
      message: err.message || 'An error occurred during the request',
      name: err.name,
      status
    }
    res.status(status).json(body)
  } else {
    const body: any = {
      fields: err.fields || undefined,
      message: 'An error occurred during the request',
      name: err.name,
      status
    }
    res.status(status).json(body)
  }
})

export default app
