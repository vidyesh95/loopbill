import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { QuoteDialog } from '@/components/customer/quote-dialog'

const plans = [
  {
    name: 'Basic',
    price: '₹999',
    description: 'Perfect for small homes',
    features: [
      'Quarterly inspections',
      'Basic pest control',
      'Free re-service',
      'Phone support',
    ],
  },
  {
    name: 'Professional',
    price: '₹9999',
    description: 'Ideal for larger homes',
    features: [
      'Monthly inspections',
      'Advanced pest control',
      'Priority re-service',
      '24/7 phone support',
      'Preventive treatments',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For commercial properties',
    features: [
      'Weekly inspections',
      'Comprehensive pest control',
      'Emergency service',
      'Dedicated manager',
      'Custom solutions',
      'Warranty included',
    ],
  },
]

const frequentlyAskedQuestions = [
  {
    question: "What's included in the basic plan?",
    answer: 'Our basic plan includes quarterly inspections, treatment for common household pests, and free re-service if pests return between scheduled visits.',
  },
  {
    question: 'Can I upgrade my plan anytime?',
    answer: 'Yes, you can upgrade your plan at any time. We’ll prorate the difference and adjust your service schedule accordingly.',
  },
  {
    question: 'Do you offer any guarantees?',
    answer: "Yes, we offer a 100% satisfaction guarantee. If you're not satisfied with our service, we'll return to re-treat at no additional cost.",
  },
]

const Pricing = () => (
    <section id="pricing" className="bg-[#f7f6f0]">
      {/* Hero */}
      <header className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-6 text-4xl font-bold heading-gradient">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your pest control needs
          </p>
        </div>
      </header>

      {/* Plans */}
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-20 md:grid-cols-3">
        {plans.map(({ name, price, description, features }) => (
            <li
                key={name}
                className="flex flex-col rounded-lg border border-gray-100 bg-white p-8 shadow-sm"
            >
              <h3 className="mb-2 text-2xl font-bold">{name}</h3>

              <div className="mb-4">
                <span className="text-4xl font-bold">{price}</span>
                {price !== 'Custom' && (
                    <span className="text-gray-600">/month</span>
                )}
              </div>

              <p className="mb-6 text-gray-600">{description}</p>

              <ul className="mb-8 flex-grow space-y-4">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                ))}
              </ul>

              <QuoteDialog
                defaultSource={`pricing:${name}`}
                defaultMessage={`Interested in the ${name} plan.`}
                trigger={<Button className="btn-primary mt-auto w-full">Get Started</Button>}
              />
            </li>
        ))}
      </ul>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <ul className="mx-auto grid max-w-3xl gap-4">
            {frequentlyAskedQuestions.map(({ question, answer }) => (
                <li key={question} className="rounded-lg bg-white p-6">
                  <h3 className="mb-2 text-lg font-semibold">{question}</h3>
                  <p className="text-gray-600">{answer}</p>
                </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
)

export default Pricing