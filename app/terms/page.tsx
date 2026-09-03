import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using the Selection House wholesale ordering platform.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: September 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>
            By registering for a business account or placing an order on this platform,
            you agree to be bound by these Terms and Conditions. If you do not agree,
            please do not use this platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Wholesale Account Eligibility</h2>
          <p>
            This platform is intended for registered shop owners, retailers, and
            distributors purchasing sports goods and related products in bulk for
            resale. Selection House reserves the right to approve, reject, or block
            any business account at its discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Pricing and Payment</h2>
          <p>
            Wholesale pricing is visible only to approved, logged-in business accounts
            and is subject to change without prior notice. All orders must be paid in
            full through the platform&apos;s payment gateway before dispatch, unless a
            separate credit arrangement has been agreed upon in writing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Minimum Order Quantities</h2>
          <p>
            Each product is subject to a Minimum Order Quantity (MOQ) as displayed on
            its product page. Orders below the stated MOQ may not be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Shipping and Delivery</h2>
          <p>
            Delivery timelines are estimates and not guaranteed. Selection House is not
            liable for delays caused by courier partners, weather, or circumstances
            beyond our reasonable control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Returns and Replacements</h2>
          <p>
            Damaged, defective, or incorrect items must be reported within 48 hours of
            delivery with photographic proof. Approved replacements will be dispatched
            at no additional cost. Products damaged due to misuse are not eligible for
            replacement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Account Suspension</h2>
          <p>
            Selection House reserves the right to suspend or terminate any business
            account found to be in violation of these terms, engaging in fraudulent
            activity, or misusing wholesale pricing for non-business purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Changes to Terms</h2>
          <p>
            These terms may be updated periodically. Continued use of the platform
            after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact</h2>
          <p>
            For questions about these terms, contact us at Station Road, Pilibhit,
            Opp. BOB Bank, Pilibhit, Uttar Pradesh, or call +91 63986 58181.
          </p>
        </section>
      </div>
    </div>
  )
}
