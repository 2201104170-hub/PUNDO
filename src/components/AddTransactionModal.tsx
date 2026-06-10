import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Input } from './index';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TransactionFormData) => void;
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
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    description: '',
    amount: '',
    currency: 'PHP',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Transaction Flow */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            TRANSACTION FLOW
          </label>
          <div className="flex items-center gap-md p-md bg-surface-container-low border border-outline-variant rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant">trending_up</span>
            <span className="text-on-surface font-body-md">Select Type</span>
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
              onChange={handleInputChange}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select type...</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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
            className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
          >
            <option value="">Select category...</option>
            <option value="food">Food & Dining</option>
            <option value="transport">Transportation</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="salary">Salary</option>
            <option value="other">Other</option>
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
            AMOUNT
          </label>
          <div className="flex gap-md">
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary w-20"
            >
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
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
        </div>

        {/* Buttons */}
        <div className="flex gap-md justify-end pt-md border-t border-outline-variant/40">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
