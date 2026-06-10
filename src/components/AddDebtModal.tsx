import React, { useState } from 'react';
import Modal from './Modal';
import { Button, Input } from './index';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DebtFormData) => void;
}

interface DebtFormData {
  personName: string;
  type: string;
  dueDate: string;
  amount: string;
  notes: string;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DebtFormData>({
    personName: '',
    type: 'I Owe',
    dueDate: '',
    amount: '',
    notes: '',
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
      personName: '',
      type: 'I Owe',
      dueDate: '',
      amount: '',
      notes: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Debt">
      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Person Name */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            Person Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </span>
            <input
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleInputChange}
              placeholder="e.g. Alex Johnson"
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
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            >
              <option value="I Owe">I Owe</option>
              <option value="They Owe Me">They Owe Me</option>
              <option value="Loan">Loan</option>
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
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-md py-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Original Amount */}
        <div>
          <label className="font-label-md text-label-md text-on-surface-variant mb-sm block">
            Original Amount
          </label>
          <div className="flex items-center gap-sm">
            <span className="text-on-surface font-headline-md">$</span>
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

        {/* Buttons */}
        <div className="flex gap-md justify-end pt-md border-t border-outline-variant/40">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Debt
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDebtModal;
