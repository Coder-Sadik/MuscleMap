import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { DataManagement } from './DataManagement'

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full p-6 pt-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your settings.</p>
      </header>
      
      <div className="flex-1 flex flex-col space-y-6">
        <DataManagement />

        <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl bg-zinc-900/30">
          <form action={signout}>
            <Button variant="destructive" type="submit" className="gap-2 h-12 px-8 rounded-xl font-bold">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
