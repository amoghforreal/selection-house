import type { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Wholesale Terms and FAQ',
  description:
    'Wholesale ordering terms, minimum order quantities, shipping, and GST invoicing policy for Selection House shop owner accounts.',
}

const FAQS = [
  {
    question: 'Who can register for a wholesale account?',
    answer:
      'Selection House wholesale accounts are for registered shop owners, retailers, and distributors of sports goods, school supplies, and related products. Individual consumers should visit our store directly rather than registering online.',
  },
  {
    question: 'Is a GST number required to register?',
    answer:
      'A GST number is recommended but not strictly required at registration. Businesses without a GST number may still be approved at our discretion, though invoicing and tax handling may differ.',
  },
  {
    question: 'How long does account approval take?',
    answer:
      'Most business accounts are reviewed and approved within 24 hours. You will be notified once your account is active and wholesale pricing becomes visible.',
  },
  {
    question: 'What is the Minimum Order Quantity (MOQ)?',
    answer:
      'Each product has its own MOQ, shown on the product page. MOQs vary by category, for example, bulkier items like cricket kits may have a lower MOQ than smaller accessories like shuttlecocks.',
  },
  {
    question: 'How does bulk pricing work?',
    answer:
      'Many products offer tiered pricing, ordering a higher quantity unlocks a lower per-unit price automatically. Tiers are shown on each product page once you are logged in.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Orders are paid online at checkout through our secure payment gateway. We accept major cards, UPI, and net banking.',
  },
  {
    question: 'How is shipping calculated?',
    answer:
      'Shipping costs depend on order size, weight, and delivery location, calculated automatically at checkout before you confirm your order.',
  },
  {
    question: 'Can I get a GST invoice for my order?',
    answer:
      'Yes, a GST invoice is generated automatically for every order and available for download from your order history once payment is confirmed.',
  },
  {
    question: 'What is your return and replacement policy?',
    answer:
      'Damaged or incorrect items must be reported within 48 hours of delivery with photo proof. Contact our support team through your dashboard or WhatsApp to initiate a replacement.',
  },
]

export default function WholesaleTermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Wholesale Terms and FAQ
        </h1>
        <p className="text-muted-foreground">
          Everything shop owners need to know about ordering with Selection House.
        </p>
      </div>

      <Accordion className="w-full">
        {FAQS.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
