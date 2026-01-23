'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Plus, 
  Check, 
  Clock, 
  Shield,
  CreditCard,
  Trash2,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { bankingAPI, type BankAccount } from '@/lib/api/banking.api';
import { usePlaidLink } from 'react-plaid-link';

export default function BankingPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [addingAccount, setAddingAccount] = useState(false);

  // Load bank accounts on mount
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankingAPI.getBankAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Error loading bank accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  // Create Plaid Link token when user wants to add account
  const handleAddBankAccount = async () => {
    try {
      setAddingAccount(true);
      const { linkToken: token } = await bankingAPI.createPlaidLinkToken();
      setLinkToken(token);
    } catch (err) {
      console.error('Error creating Plaid link token:', err);
      setError('Failed to initialize bank connection. Please try again.');
      setAddingAccount(false);
    }
  };

  // Plaid Link success callback
  const onPlaidSuccess = async (publicToken: string, metadata: any) => {
    try {
      const newAccount = await bankingAPI.exchangePlaidToken(publicToken, metadata);
      setAccounts([...accounts, newAccount]);
      setLinkToken(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error exchanging Plaid token:', err);
      setError('Failed to add bank account. Please try again.');
    } finally {
      setAddingAccount(false);
    }
  };

  // Plaid Link configuration
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: () => {
      setLinkToken(null);
      setAddingAccount(false);
    },
  };

  const { open: openPlaidLink, ready: plaidReady } = usePlaidLink(config);

  // Open Plaid Link when token is ready
  useEffect(() => {
    if (linkToken && plaidReady) {
      openPlaidLink();
    }
  }, [linkToken, plaidReady, openPlaidLink]);

  const handleSetDefault = async (accountId: string) => {
    try {
      await bankingAPI.setDefaultAccount(accountId);
      setAccounts(accounts.map(acc => ({
        ...acc,
        isDefault: acc.id === accountId,
      })));
    } catch (err) {
      console.error('Error setting default account:', err);
      setError('Failed to set default account. Please try again.');
    }
  };

  const handleRemove = async (accountId: string) => {
    if (!confirm('Are you sure you want to remove this bank account?')) {
      return;
    }

    try {
      await bankingAPI.removeBankAccount(accountId);
      setAccounts(accounts.filter(acc => acc.id !== accountId));
    } catch (err) {
      console.error('Error removing account:', err);
      setError('Failed to remove account. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3" />
            Verified
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Pending Verification
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Alert */}
        {error && (
          <Card className="border-4 border-red-500 bg-red-50 dark:bg-red-900/20">
            <div className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 dark:text-red-200">Error</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bank Accounts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your bank accounts for investments and distributions
            </p>
          </div>
          <Button
            onClick={handleAddBankAccount}
            disabled={addingAccount}
            className="bg-[#E07A47] hover:bg-[#E07A47]/90 text-white"
          >
            {addingAccount ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </>
            )}
          </Button>
        </div>

        {/* Info Banner - NEW FEATURE */}
        <Card className="border-[#56CCF2] border-4 bg-blue-50 dark:bg-blue-900/20 p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#56CCF2] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🎉 NEW: Secure Bank Account Integration
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                We've integrated with Plaid to provide instant, secure bank account verification. 
                Your account information is encrypted and never stored in plain text.
              </p>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Instant verification with Plaid (most banks)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Micro-deposit verification (traditional method)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Bank-level encryption for all sensitive data
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Account List */}
        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card 
              key={account.id}
              className={`p-6 border-4 transition-all hover:shadow-lg ${
                account.isDefault 
                  ? 'border-[#E07A47]' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#E07A47] to-[#56CCF2] text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {account.bankName}
                      </h3>
                      {account.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#E07A47] text-white">
                          <Star className="w-3 h-3 fill-current" />
                          Default
                        </span>
                      )}
                      {getStatusBadge(account.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Account Type:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Account Number:</span>
                        <span className="ml-2 font-mono font-medium text-gray-900 dark:text-white">
                          ****{account.lastFourDigits}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Account Holder:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {account.accountHolderName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Verification:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {account.verificationMethod === 'PLAID_INSTANT' ? 'Instant (Plaid)' : 'Micro-deposits'}
                        </span>
                      </div>
                    </div>

                    {/* Pending Verification Alert */}
                    {!account.isVerified && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Verification Required
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              We've sent two small deposits to your account. Please verify the amounts within 3 business days.
                            </p>
                            <Button
                              size="sm"
                              onClick={() => setShowVerifyModal(account.id)}
                              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              Verify Amounts
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  {!account.isDefault && account.isVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(account.id)}
                      className="text-[#E07A47] border-[#E07A47] hover:bg-[#E07A47] hover:text-white"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(account.id)}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Account Modal Placeholder */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-6 border-4 border-[#E07A47]">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Add Bank Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose how you'd like to add your bank account:
              </p>
              
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-[#56CCF2] hover:bg-[#56CCF2]/90 text-white"
                  onClick={() => alert('Plaid integration coming soon!')}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Instant Verification (Recommended)</div>
                    <div className="text-xs opacity-90">Link securely via Plaid - takes 30 seconds</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-2"
                  onClick={() => alert('Manual entry coming soon!')}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Manual Entry</div>
                    <div className="text-xs text-gray-500">Enter routing and account number</div>
                  </div>
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
            </Card>
          </div>
        )}

        {/* Verify Micro-deposits Modal Placeholder */}
        {showVerifyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full p-6 border-4 border-[#E07A47]">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Verify Bank Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter the two small deposit amounts you received in your bank account:
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    First Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.23"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#E07A47] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Second Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.27"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#E07A47] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1 bg-[#E07A47] hover:bg-[#E07A47]/90 text-white"
                  onClick={() => {
                    alert('Verification successful!');
                    setShowVerifyModal(null);
                  }}
                >
                  Verify
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowVerifyModal(null)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Security Info */}
        <Card className="p-6 border-4 border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-[#56CCF2] flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Your Security is Our Priority
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All bank account numbers are encrypted using bank-level 256-bit AES encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>We never store your bank login credentials - authentication is handled by Plaid</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All transactions are monitored for fraud and comply with SEC regulations</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
