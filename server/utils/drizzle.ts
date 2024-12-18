import { drizzle } from 'drizzle-orm/libsql'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  const { dbFileName } = useRuntimeConfig();
  return drizzle(dbFileName, { schema })
}