import { consola } from 'consola'
import { getMigrations } from 'better-auth/db'
import { serverAuth } from '../utils/auth'

export default defineNitroPlugin((nitro) => {
  if (!import.meta.dev) {
    return
  }

  nitro.hooks.hookOnce('request', async () => { 
    const auth = serverAuth();
    
    const { toBeCreated, toBeAdded, runMigrations, compileMigrations } = await getMigrations(auth.options)
    if (!toBeCreated.length && !toBeAdded.length) {
      return
    }
    consola.info(`[better-auth] Database migrations will affect the following tables:`)

    for (const table of [...toBeCreated, ...toBeAdded]) {
      consola.log(`\`${table.table}\` table with ${Object.keys(table.fields).map(f => `\`${f}\``).join(', ')} fields.`)
    }
    try {
      await runMigrations()
      consola.success('[better-auth] Database migrations ran successfully')
    } catch (error) {
      consola.error(error)
    }
  })
})
