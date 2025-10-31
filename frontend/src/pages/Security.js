import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Security = () => {
  const securityTips = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Protect Your PIN",
      description: "Never share your UPI PIN, ATM PIN, or password with anyone, including bank officials.",
      color: "from-red-100 to-red-200 text-red-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Verify Before Sending",
      description: "Always double-check recipient details before confirming any payment transaction.",
      color: "from-blue-100 to-blue-200 text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Use Official Apps Only",
      description: "Download payment apps only from official app stores. Avoid third-party sources.",
      color: "from-emerald-100 to-emerald-200 text-emerald-600"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Beware of Scam Calls",
      description: "Banks never ask for OTP or PIN over phone. Hang up and report such calls immediately.",
      color: "from-orange-100 to-orange-200 text-orange-600"
    }
  ];

  const faqs = [
    {
      question: "What should I do if I receive a suspicious payment request?",
      answer: "Do not respond or click any links. Contact your bank immediately using the official customer care number. Report the incident to cyber crime portal (cybercrime.gov.in)."
    },
    {
      question: "How can I identify a fake payment app?",
      answer: "Check the developer name, number of downloads, and reviews on the app store. Official apps are published by verified developers and have millions of downloads. Never download payment apps from websites or unknown sources."
    },
    {
      question: "What if my payment fails but money is deducted?",
      answer: "Don't panic. Failed transactions are usually reversed within 3-7 working days. Keep the transaction reference number and contact your bank if the amount isn't refunded within this period."
    },
    {
      question: "How do I secure my mobile device?",
      answer: "Use a strong screen lock (PIN/Pattern/Biometric). Keep your operating system and apps updated. Install apps only from official stores. Enable 'Find My Device' feature for emergency situations."
    },
    {
      question: "What information should I never share?",
      answer: "Never share: UPI PIN, ATM PIN, OTP (One-Time Password), CVV number, full card details, bank account password, or Aadhaar number. Legitimate organizations will never ask for these details."
    },
    {
      question: "How do I report a fraud transaction?",
      answer: "Immediately contact your bank's customer care. File a complaint at your nearest police station. Report online at cybercrime.gov.in. Block your card/account if necessary. Keep all transaction details and screenshots ready."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Payment Security
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Stay safe while making digital transactions
          </p>
        </div>

        {/* Security Tips Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {securityTips.map((tip, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 card-hover animate-fade-in stagger-${index + 1}`}
              data-testid={`security-tip-${index}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center mb-6`}>
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-16 animate-fade-in">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Common Scams to Avoid</h3>
              <ul className="space-y-3 text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Fake Customer Support:</strong> Scammers pretending to be bank officials asking for PIN or OTP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>QR Code Scams:</strong> Receiving money requests instead of payment QR codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Lottery/Prize Scams:</strong> Messages claiming you won a prize and asking for payment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>APK Download Links:</strong> Links to download fake payment apps from untrusted sources</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-gray-100 rounded-xl px-6 hover:border-emerald-200 transition-colors"
                data-testid={`faq-${index}`}
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-white text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg opacity-90 mb-8">
            If you've been a victim of fraud or have security concerns
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-sm text-emerald-100 mb-2">National Cyber Crime Helpline</p>
              <p className="text-3xl font-bold">1930</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-sm text-emerald-100 mb-2">Report Online</p>
              <p className="text-xl font-bold">cybercrime.gov.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;