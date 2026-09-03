import Link from 'next/link'
import { Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your Account Is Under Review</CardTitle>
          <CardDescription>
            Thank you for registering your business with Selection House. Our team
            verifies every new account to keep wholesale pricing exclusive to genuine
            shop owners.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Approval usually takes less than 24 hours. You will be able to log in
            and view wholesale pricing as soon as your business is approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button render={<Link href="/" />}>Back to Home</Button>
            <Button
              variant="outline"
              render={
                <Link
                  href="https://wa.me/916398658181"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us on WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
