import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the Selection House wholesale ordering platform.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: September 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>
            When you register a business account, we collect your name, phone number,
            email address, shop name, GST number (if provided), and business address.
            When you place an order, we collect shipping address and order details
            necessary to fulfil that order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>
            Your information is used to verify your business, process orders, generate
            invoices, communicate order updates, and provide customer support. We do
            not sell your information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Payment Information</h2>
          <p>
            Payments are processed securely through our third-party payment gateway.
            Selection House does not store your full card or bank account details on
            its own servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Storage and Security</h2>
          <p>
            Your data is stored on secure, access-controlled servers. Wholesale pricing
            and business data are protected behind account authentication and are only
            accessible to your business account and authorized Selection House staff.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Communication</h2>
          <p>
            We may contact you via email, SMS, or WhatsApp regarding order updates,
            account status, or important account related notices. You may opt out of
            promotional communication at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your account
            information at any time by contacting our support team.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Changes to This Policy</h2>
          <p>
            This privacy policy may be updated periodically. Continued use of the
            platform after changes are posted constitutes acceptance of the revised
            policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
          <p>
            For privacy related questions, contact us at Station Road, Pilibhit,
            Opp. BOB Bank, Pilibhit, Uttar Pradesh, or call +91 63986 58181.
          </p>
        </section>
      </div>
    </div>
  )
}
