import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: 3000,
  secrets: {
    jwt: "abc",
    jwtExp: '100d'
  }
}

let envConfig = {}

export default merge(baseConfig, envConfig)
