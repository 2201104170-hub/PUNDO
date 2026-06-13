import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { Button, Input } from './index';
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_CATEGORIES } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getCountriesList, getCurrencySymbol } from '../utils/currency';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TransactionFormData) => void | Promise<void>;
  isLoading?: boolean;
}

interface TransactionFormData {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currency } = useAuth();
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    description: '',
    amount: '',
    currency: currency,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      category: '',
      description: '',
      amount: '',
      currency: 'PHP',
    });
    onClose();
  };

  // Get category options based on selected type
  const categoryOptions = useMemo(() => {
    if (!formData.type) return [];
    return TRANSACTION_CATEGORIES[formData.type] || [];
  }, [formData.type]);

  // Get transaction type label and icon
  const selectedTypeOption = TRANSACTION_TYPE_OPTIONS.find(t => t.value === formData.type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Transaction Flow */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            TRANSACTION FLOW
          </label>
          <div className="flex items-center gap-md p-md bg-surface-container-low border border-outline-variant rounded-lg">
            <span className={`material-symbols-outlined ${
              selectedTypeOption ? selectedTypeOption.color : 'text-on-surface-variant'
            }`}>
              {selectedTypeOption ? selectedTypeOption.icon : 'trending_up'}
            </span>
            <span className="text-on-surface font-body-md">
              {selectedTypeOption ? selectedTypeOption.label : 'Select Type'}
            </span>
          </div>
        </div>

        {/* Date and Type Row */}
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              DATE
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
              TYPE
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => {
                handleInputChange(e);
                // Reset category when type changes
                setFormData((prev) => ({
                  ...prev,
                  category: '',
                }));
              }}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select type...</option>
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            CATEGORY
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={!formData.type}
            className={`w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary ${
              !formData.type ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select category...</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            DESCRIPTION
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="e.g. Grocery run, Client payment..."
            className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary resize-none h-20"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            AMOUNT (OPTIONAL CURRENCY)
          </label>
          <div className="flex gap-md">
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
              className="flex-1 bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            />
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
            Your default currency: {getCurrencySymbol(currency)} ({currency})
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-md justify-end pt-md border-t border-outline-variant/40">
          <Button variant="secondary" onClick={onClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin inline mr-2">
                  progress_activity
                </span>
                Saving...
              </>
            ) : (
              'Save Transaction'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
