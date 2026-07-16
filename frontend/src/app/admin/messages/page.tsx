/* ============================================================
   ABS — Inquiries & Messages Manager
   Allows administrators to review contact forms, callback enquiries,
   and newsletters subscriptions, with reply and mark-as-read options.
   ============================================================ */

'use client';

import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { usePermission } from '@/hooks/usePermission';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import styles from './Messages.module.css';
import { DataTable, Modal } from '@/components/admin';
import { Button, Skeleton } from '@/components/ui';
import { MailOpen, Trash, Reply, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: 'Contact' | 'Newsletter' | 'Callback' | 'Enquiry';
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export default function AdminMessagesPage() {
  const { can } = usePermission();
  const queryClient = useQueryClient();

  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Fetch messages listing
  const { data: messages, isLoading } = useFetch<Message[]>(
    '/admin/messages',
    ['admin_messages_all'],
    { params: { per_page: 100 } }
  );

  const handleOpenDetails = (msg: Message) => {
    setActiveMessage(msg);
    setReplyText('');
    setModalOpen(true);
    
    // Auto mark as read when opened if not read already
    if (!msg.is_read) {
      handleMarkRead(msg.id);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`/admin/messages/${id}/read`);
      queryClient.invalidateQueries({ queryKey: ['admin_messages_all'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    } catch {
      // Fail silently for HMR triggers
    }
  };

  const handleSendReply = async () => {
    if (!activeMessage || !replyText.trim()) return;
    setReplying(true);
    try {
      await api.post(`/admin/messages/${activeMessage.id}/reply`, {
        reply: replyText,
      });
      toast.success('Reply sent successfully (simulated email dispatch).');
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin_messages_all'] });
    } catch {
      toast.error('Failed to send reply.');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (msg: Message) => {
    if (!can('messages.delete')) {
      toast.error('Forbidden: Insufficient privileges.');
      return;
    }
    if (confirm(`Are you sure you want to delete inquiry from ${msg.name}?`)) {
      try {
        await api.delete(`/admin/messages/${msg.id}`);
        toast.success('Inquiry deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['admin_messages_all'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      } catch {
        toast.error('Failed to delete message.');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Sender Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'source', label: 'Inquiry Source', sortable: true },
    {
      key: 'is_read',
      label: 'Read Status',
      sortable: true,
      render: (row: Message) => row.is_read ? (
        <span style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)' }}>Read</span>
      ) : (
        <span style={{ color: 'var(--color-info)', fontWeight: 'bold', fontSize: 'var(--text-xs)' }}>New Inquiry</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date Received',
      sortable: true,
      render: (row: Message) => new Date(row.created_at).toLocaleDateString('en-IN'),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div style={{ color: 'var(--color-gold)' }}>Loading message register...</div>
      ) : (
        <DataTable
          title="Campus Inquiries & Messages"
          subtitle="View and reply to general questions, callback enquiries, and newsletter subscribers"
          columns={columns}
          data={messages || []}
          searchPlaceholder="Search messages..."
          searchKeys={['name', 'email', 'subject', 'message']}
          onEdit={handleOpenDetails} // Edit acts as details viewer
          onDelete={can('messages.delete') ? handleDelete : undefined}
          actionsColumnWidth="80px"
        />
      )}

      {/* Details View Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeMessage ? `Message Details` : 'Loading...'}
        maxWidth="600px"
      >
        {activeMessage ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            {/* Sender Meta Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
              <div>
                <span className={styles.label}>SENDER NAME</span>
                <strong style={{ color: 'var(--color-white)' }}>{activeMessage.name}</strong>
              </div>
              <div>
                <span className={styles.label}>EMAIL ADDRESS</span>
                <strong style={{ color: 'var(--color-white)' }}>{activeMessage.email}</strong>
              </div>
              <div>
                <span className={styles.label}>PHONE / MOBILE</span>
                <span style={{ color: 'var(--color-off-white)' }}>{activeMessage.phone || 'N/A'}</span>
              </div>
              <div>
                <span className={styles.label}>INQUIRY SOURCE</span>
                <span style={{ color: 'var(--color-gold-light)', fontWeight: 'bold' }}>{activeMessage.source}</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span className={styles.label}>SUBJECT</span>
                <strong style={{ color: 'var(--color-white)' }}>{activeMessage.subject || 'No Subject'}</strong>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className={styles.label}>MESSAGE BODY</span>
              <div style={{
                backgroundColor: 'var(--color-navy-light)',
                border: '1px solid var(--color-border)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-off-white)',
                lineHeight: 'var(--leading-relaxed)',
                whiteSpace: 'pre-wrap'
              }}>
                {activeMessage.message}
              </div>
            </div>

            {/* Reply block */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <span className={styles.label}>SEND EMAIL REPLY</span>
              {activeMessage.replied_at ? (
                <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', fontStyle: 'italic' }}>
                  ✓ A reply was sent on {new Date(activeMessage.replied_at).toLocaleString('en-IN')}.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={styles.textarea}
                    placeholder="Type email reply message body..."
                    rows={4}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={replying || !replyText.trim()}
                    variant="primary"
                    size="sm"
                    style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Reply size={14} /> {replying ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button onClick={() => setModalOpen(false)} variant="secondary" size="md">
                Close View
              </Button>
            </div>

          </div>
        ) : null}
      </Modal>
    </div>
  );
}
