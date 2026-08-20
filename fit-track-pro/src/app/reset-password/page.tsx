import { resetPassword } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await searchParams;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full min-h-screen">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Update Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md border border-destructive/20 text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm bg-primary/15 text-primary rounded-md border border-primary/20 text-center">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-background/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button formAction={resetPassword} className="w-full">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
