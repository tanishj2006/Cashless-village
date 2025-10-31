import { useState } from 'react';
import axios from 'axios';
import { API, getSessionId } from '../App';
import { Smartphone, Wallet, CreditCard, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

const Practice = () => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const sessionId = getSessionId();

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-6 h-6" />, example: 'user@upi' },
    { id: 'wallet', name: 'Mobile Wallet', icon: <Wallet className="w-6 h-6" />, example: '9876543210' },
    { id: 'card', name: 'Debit/Credit Card', icon: <CreditCard className="w-6 h-6" />, example: '4111 1111 1111 1111' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !recipient) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setProcessing(true);
    setSuccess(false);

    // Simulate processing delay
    setTimeout(async () => {
      try {
        await axios.post(`${API}/demo-transaction`, {
          session_id: sessionId,
          payment_method: paymentMethod,
          amount: parseFloat(amount),
          recipient: recipient
        });
        
        setSuccess(true);
        toast.success('Payment successful! (Demo Mode)');
        
        // Reset form after success
        setTimeout(() => {
          setAmount('');
          setRecipient('');
          setSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error processing demo transaction:', error);
        toast.error('Transaction failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Practice Mode
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Try digital payments in a safe demo environment
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>This is a demo - No real money will be transferred</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in-left" data-testid="payment-form">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Payment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-semibold text-gray-700 mb-3 block">
                  Select Payment Method
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                      }`}
                      data-testid={`method-${method.id}`}
                    >
                      {method.icon}
                      <span className="text-xs font-medium text-center">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div>
                <Label htmlFor="recipient" className="text-base font-semibold text-gray-700 mb-2 block">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder={paymentMethods.find(m => m.id === paymentMethod)?.example}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="h-12 text-base"
                  disabled={processing}
                  data-testid="recipient-input"
                />
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount" className="text-base font-semibold text-gray-700 mb-2 block">
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-base"
                  disabled={processing}
                  data-testid="amount-input"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={processing || success}
                className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg"
                data-testid="pay-btn"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Success!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Pay ₹{amount || '0.00'}
                  </>
                )}
              </Button>
            </form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl animate-fade-in" data-testid="success-message">
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Payment Successful!</p>
                    <p className="text-sm">₹{amount} sent to {recipient}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Safety Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-emerald-600" />
                Safety Tips
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Always verify recipient details before sending</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Never share your PIN or OTP with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Check transaction limits set by your bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Save transaction screenshots for records</span>
                </li>
              </ul>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Did You Know?</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold mb-1">24/7</p>
                  <p className="text-emerald-100">UPI works round the clock</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">₹0</p>
                  <p className="text-emerald-100">No transaction charges</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">&lt;10s</p>
                  <p className="text-emerald-100">Average transaction time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;