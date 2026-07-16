'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contactService } from '@/services/contactService';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  program: z.string().min(1, 'Please select a program of interest'),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const EnquiryForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    try {
      await contactService.submitContact({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: `Quick Enquiry: ${data.program}`,
        message: `Interested in program: ${data.program}. Please contact back.`,
        source: 'Enquiry',
      });
      toast.success('Inquiry submitted successfully! Our counselor will call you back.');
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        width: '100%',
        padding: 'var(--space-4)',
        background: 'rgba(15, 32, 68, 0.4)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-white)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
        Quick Enquiry
      </h3>

      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Your Name"
          {...register('name')}
          style={{
            borderColor: errors.name ? 'var(--color-error)' : undefined,
          }}
        />
        {errors.name && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email Address"
          {...register('email')}
          style={{
            borderColor: errors.email ? 'var(--color-error)' : undefined,
          }}
        />
        {errors.email && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          placeholder="Mobile Number"
          {...register('phone')}
          style={{
            borderColor: errors.phone ? 'var(--color-error)' : undefined,
          }}
        />
        {errors.phone && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.phone.message}
          </span>
        )}
      </div>

      {/* Program of interest */}
      <div>
        <select
          {...register('program')}
          style={{
            borderColor: errors.program ? 'var(--color-error)' : undefined,
          }}
        >
          <option value="">Select Program of Interest</option>
          <option value="MBA AI & Business Analytics">MBA (AI & Business Analytics)</option>
          <option value="BBA Business Analytics">BBA (Business Analytics)</option>
          <option value="PhD Management">PhD in Management</option>
        </select>
        {errors.program && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.program.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        size="md"
        fullWidth
        style={{ marginTop: 'var(--space-2)' }}
      >
        Submit Enquiry
      </Button>
    </form>
  );
};
