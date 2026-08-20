import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full p-6 pt-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your settings.</p>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20 p-6">
        <p className="text-muted-foreground text-sm">User settings here</p>
        
        <form action={signout}>
          <Button variant="destructive" type="submit" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
