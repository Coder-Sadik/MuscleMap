'use client';

import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { DataManagement } from './DataManagement'
import { BodyMetrics } from './BodyMetrics'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ProfilePage() {
  const { dict } = useLanguage();

  return (
    <div className="flex flex-col h-full p-6 pt-12 space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{dict.profile.title}</h1>
        <p className="text-muted-foreground">{dict.profile.subtitle}</p>
      </header>

      <div className="flex-1 flex flex-col space-y-6">
        <LanguageToggle />

        <BodyMetrics />

        <DataManagement />

        <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl bg-zinc-900/30">
          <form action={signout}>
            <Button variant="destructive" type="submit" className="gap-2 h-12 px-8 rounded-xl font-bold">
              <LogOut className="w-4 h-4" />
              {dict.profile.signOut}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
