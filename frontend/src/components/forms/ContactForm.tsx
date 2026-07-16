'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contactService } from '@/services/contactService';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await contactService.submitContact({
        ...data,
        source: 'Contact',
      });
      toast.success('Inquiry submitted successfully! We will contact you soon.');
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
        gap: 'var(--space-4)',
        width: '100%',
      }}
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
          }}
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
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
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
          }}
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
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
        <label
          htmlFor="phone"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
          }}
        >
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+91-XXXXX-XXXXX"
          {...register('phone')}
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
          }}
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Admissions inquiry / Fees / Brochure"
          {...register('subject')}
          style={{
            borderColor: errors.subject ? 'var(--color-error)' : undefined,
          }}
        />
        {errors.subject && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.subject.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-muted)',
            marginBottom: 'var(--space-1)',
            textTransform: 'uppercase',
          }}
        >
          Your Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Please describe your query in detail..."
          {...register('message')}
          style={{
            borderColor: errors.message ? 'var(--color-error)' : undefined,
          }}
        />
        {errors.message && (
          <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        style={{ marginTop: 'var(--space-2)' }}
      >
        Submit Message
      </Button>
    </form>
  );
};
