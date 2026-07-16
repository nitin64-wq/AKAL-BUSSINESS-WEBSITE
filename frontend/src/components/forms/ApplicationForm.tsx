'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { programService } from '@/services/programService';
import { admissionService } from '@/services/admissionService';
import { Button } from '@/components/ui';
import type { Program } from '@/types';
import toast from 'react-hot-toast';
import styles from './ApplicationForm.module.css';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const applicationSchema = z.object({
  program_id: z.string().min(1, 'Please select a program'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
  category: z.enum(['General', 'SC', 'ST', 'OBC', 'EWS', 'PWD']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 characters'),
  last_qualification: z.string().min(2, 'Qualification is required'),
  marks_percentage: z.coerce.number().min(0, 'Marks must be positive').max(100, 'Marks cannot exceed 100'),
  entrance_exam: z.string().optional(),
  entrance_score: z.string().optional(),
  work_experience: z.coerce.number().min(0, 'Experience cannot be negative'),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const ApplicationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: {
      gender: 'Male',
      category: 'General',
      work_experience: 0,
      marks_percentage: 0,
    },
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getAll();
        if (response.status === 'success') {
          setPrograms(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch programs', err);
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    let fieldsToValidate: (keyof ApplicationFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['program_id', 'full_name', 'email', 'phone', 'date_of_birth', 'gender', 'category'];
    } else if (step === 2) {
      fieldsToValidate = ['address', 'city', 'state', 'pincode', 'last_qualification', 'marks_percentage'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    setSubmitting(true);
    try {
      const response = await admissionService.apply({
        ...values,
        program_id: parseInt(values.program_id),
      });
      if (response.status === 'success') {
        toast.success('Application submitted successfully!');
        setSuccessCode(response.data.application_no);
      } else {
        toast.error(response.message || 'Submission failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit application. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successCode) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>🎉</div>
        <h3 className={styles.successTitle}>Application Submitted!</h3>
        <p className={styles.successDescription}>
          Thank you for applying. Your application has been logged under the following code. Please save it for your records.
        </p>
        <div className={styles.successCodeWrapper}>{successCode}</div>
        <div>
          <Link href="/admissions/track" className={styles.trackLink}>
            Track Application Status <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      {/* Steps Indicator */}
      <div className={styles.stepsContainer}>
        <div className={styles.stepIndicatorLine} />
        <div
          className={styles.stepIndicatorProgress}
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        />

        {[1, 2, 3].map((num) => {
          const isCompleted = step > num;
          const isActive = step === num;
          return (
            <div key={num} className={styles.stepNode}>
              <div
                className={`${styles.stepCircle} ${
                  isCompleted ? styles.stepCircleCompleted : isActive ? styles.stepCircleActive : ''
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} strokeWidth={3} /> : num}
              </div>
              <span
                className={`${styles.stepTitle} ${
                  isCompleted ? styles.stepTitleCompleted : isActive ? styles.stepTitleActive : ''
                }`}
              >
                {num === 1 ? 'Personal' : num === 2 ? 'Academic' : 'Experience'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal & Course */}
        {step === 1 && (
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <h4 className={styles.sectionTitle}>Step 1: Program & Personal Information</h4>
            </div>

            {/* Program selection */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="program_id">Select Program *</label>
              <select
                id="program_id"
                {...register('program_id')}
                disabled={loadingPrograms}
                className={styles.select}
              >
                {loadingPrograms ? (
                  <option>Loading programs...</option>
                ) : (
                  <>
                    <option value="">-- Choose Program --</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title} ({prog.type})
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.program_id && (
                <span className={styles.errorText}>
                  {errors.program_id.message}
                </span>
              )}
            </div>

            {/* Name */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="full_name">Full Applicant Name *</label>
              <input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register('full_name')}
                className={styles.input}
              />
              {errors.full_name && (
                <span className={styles.errorText}>
                  {errors.full_name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={styles.input}
              />
              {errors.email && (
                <span className={styles.errorText}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">Mobile Number *</label>
              <input
                id="phone"
                type="tel"
                placeholder="+91-XXXXX-XXXXX"
                {...register('phone')}
                className={styles.input}
              />
              {errors.phone && (
                <span className={styles.errorText}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* DOB */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="date_of_birth">Date of Birth *</label>
              <input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
                className={styles.input}
              />
              {errors.date_of_birth && (
                <span className={styles.errorText}>
                  {errors.date_of_birth.message}
                </span>
              )}
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="gender">Gender *</label>
              <select id="gender" {...register('gender')} className={styles.select}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Category */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="category">Category *</label>
              <select id="category" {...register('category')} className={styles.select}>
                <option value="General">General (Unreserved)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="PWD">Persons with Disabilities (PWD)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Address & Education */}
        {step === 2 && (
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <h4 className={styles.sectionTitle}>Step 2: Address & Academic Details</h4>
            </div>

            {/* Address */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="address">Address Line *</label>
              <input
                id="address"
                type="text"
                placeholder="123 Street name, Area"
                {...register('address')}
                className={styles.input}
              />
              {errors.address && (
                <span className={styles.errorText}>
                  {errors.address.message}
                </span>
              )}
            </div>

            {/* City */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                placeholder="Patiala"
                {...register('city')}
                className={styles.input}
              />
              {errors.city && (
                <span className={styles.errorText}>
                  {errors.city.message}
                </span>
              )}
            </div>

            {/* State */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="state">State *</label>
              <input
                id="state"
                type="text"
                placeholder="Punjab"
                {...register('state')}
                className={styles.input}
              />
              {errors.state && (
                <span className={styles.errorText}>
                  {errors.state.message}
                </span>
              )}
            </div>

            {/* Pincode */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pincode">Pincode *</label>
              <input
                id="pincode"
                type="text"
                placeholder="147001"
                {...register('pincode')}
                className={styles.input}
              />
              {errors.pincode && (
                <span className={styles.errorText}>
                  {errors.pincode.message}
                </span>
              )}
            </div>

            {/* Last Qualification */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="last_qualification">Last Qualification *</label>
              <input
                id="last_qualification"
                type="text"
                placeholder="B.Com / B.Sc / 12th Standard"
                {...register('last_qualification')}
                className={styles.input}
              />
              {errors.last_qualification && (
                <span className={styles.errorText}>
                  {errors.last_qualification.message}
                </span>
              )}
            </div>

            {/* Aggregate Marks */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="marks_percentage">Aggregate Marks (%) *</label>
              <input
                id="marks_percentage"
                type="number"
                step="0.01"
                placeholder="78.50"
                {...register('marks_percentage')}
                className={styles.input}
              />
              {errors.marks_percentage && (
                <span className={styles.errorText}>
                  {errors.marks_percentage.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Optional Exams & Work Exp */}
        {step === 3 && (
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <h4 className={styles.sectionTitle}>Step 3: Entrance Exams & Work Experience</h4>
            </div>

            {/* Entrance Exam */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="entrance_exam">Entrance Exam Taken (Optional)</label>
              <input
                id="entrance_exam"
                type="text"
                placeholder="CAT / CMAT / MAT / NET"
                {...register('entrance_exam')}
                className={styles.input}
              />
            </div>

            {/* Exam Score */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="entrance_score">Exam Score / Percentile (Optional)</label>
              <input
                id="entrance_score"
                type="text"
                placeholder="92.4 %ile / 580 Score"
                {...register('entrance_score')}
                className={styles.input}
              />
            </div>

            {/* Work Exp */}
            <div className={styles.fullWidth}>
              <label className={styles.label} htmlFor="work_experience">Work Experience (In Months, Optional)</label>
              <input
                id="work_experience"
                type="number"
                placeholder="12"
                {...register('work_experience')}
                className={styles.input}
              />
            </div>

            <div className={`${styles.infoBox} ${styles.fullWidth}`}>
              📢 <strong>Document Verification:</strong> Original certificates, transcripts, and identity proofs will be required for physical verification during the admissions counseling process. Please make sure the entered email and mobile numbers are correct as all future communication will be sent to them.
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className={styles.actions}>
          {step > 1 ? (
            <Button variant="secondary" onClick={handlePrev} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} /> Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button variant="primary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Next Step <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="primary" type="submit" isLoading={submitting}>
              Submit Application
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
