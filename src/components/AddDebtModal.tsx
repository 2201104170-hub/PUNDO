import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from './index';
import { debtApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getCountriesList, getCurrencySymbol } from '../utils/currency';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DebtFormData) => void | Promise<void>;
}

interface DebtFormData {
  creditor: string;
  type: string;
  dueDate: string;
  amount: string;
  interestRate: string;
  notes: string;
  currency?: string;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { currency } = useAuth();
  const [formData, setFormData] = useState<DebtFormData>({
    creditor: '',
    type: 'i_owe',
    dueDate: '',
    amount: '',
    interestRate: '',
    notes: '',
    currency: currency,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await debtApi.create(formData);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Debt created successfully!',
        });

        // Call parent onSubmit if provided
        if (onSubmit) {
          await onSubmit(formData);
        }

        // Reset form after 1.5 seconds
        setTimeout(() => {
          setFormData({
            creditor: '',
            type: 'i_owe',
            dueDate: '',
            amount: '',
            interestRate: '',
            notes: '',
            currency: currency,
          });
          setMessage(null);
          onClose();
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to create debt',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Debt">
      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Creditor Name */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            Creditor Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </span>
            <input
              type="text"
              name="creditor"
              value={formData.creditor}
              onChange={handleInputChange}
              placeholder="e.g. Bank of America"
              required
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm pl-12 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Type and Due Date Row */}
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            >
              <option value="i_owe">I Owe</option>
              <option value="they_owe_me">They Owe Me</option>
            </select>
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Amount and Interest Rate Row */}
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              Amount (OPTIONAL CURRENCY)
            </label>
            <div className="space-y-xs">
              <div className="flex gap-sm items-end">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
                >
                  {getCountriesList().map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code} ({country.symbol})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="flex-1 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
                />
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Your default: {getCurrencySymbol(currency)} ({currency})
              </p>
            </div>
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              Interest Rate (%) [Optional]
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add details about this debt..."
            className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary resize-none h-20"
          />
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-md rounded-lg ${
            message.type === 'success'
              ? 'bg-primary-container/20 text-primary'
              : 'bg-error-container/20 text-error'
          }`}>
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-md justify-end pt-md border-t border-outline-variant/40">
          <Button variant="secondary" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Debt'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDebtModal;
