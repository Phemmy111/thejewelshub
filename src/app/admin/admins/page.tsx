import { getAdmins } from './actions'
import { AdminsManagerClient } from './AdminsManagerClient'

export const metadata = { title: 'Manage Admins - The Jeweller\'s Hub' }

export default async function AdminsPage() {
  const admins = await getAdmins()
  return <AdminsManagerClient initialAdmins={admins} />
}
