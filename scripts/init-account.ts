import { db } from '@/server/db'
import { user } from '@/server/db/schema/auth'

console.log('\n🚨 WARNING: This will delete ALL account data!')
console.log('⚠️  This action is IRREVERSIBLE!')
console.log('')

const input = prompt('Type "yes" or "y" to confirm: ')

if (input?.toLowerCase() !== 'yes' && input?.toLowerCase() !== 'y') {
  console.log('❌ Cancelled')
  process.exit(0)
}

console.log('\n🔄 Deleting...')

try {
  await db.delete(user)

  console.log('\n✅ Done! You can register new accounts now.')
  process.exit(0)
} catch (error) {
  console.error('\n❌ Failed:', error)
  process.exit(1)
}
