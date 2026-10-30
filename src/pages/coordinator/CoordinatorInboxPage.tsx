import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { SegmentedTabs } from '../../components/coordinator/SegmentedTabs';
import { 
  Inbox, 
  Mic, 
  MessageSquare, 
  Bell, 
  Clock, 
  Check, 
  ChevronRight, 
  Play, 
  ArrowLeft,
  Users
} from 'lucide-react';

export const CoordinatorInboxPage: React.FC = () => {
  usePageTitle(
    'Coordinator Inbox - Samarth Watch',
    'Combined message hub for voice check-in notes, family inquiries, and urgent system alerts.'
  );

  const { showToast } = useToast();
  const {
    t,
    voiceNotes,
    roleNotifications,
    markNotificationRead,
    seniors,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'voice_notes' | 'family' | 'system'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Combine items: voice notes, notifications, family messages
  const combinedItems = useMemo(() => {
    const list: Array<{
      id: string;
      kind: 'voice_note' | 'family' | 'system';
      senderName: string;
      title: string;
      preview: string;
      timestamp: number;
      isRead: boolean;
      cues?: any[];
      durationSeconds?: number;
    }> = [];

    // Voice notes
    voiceNotes.forEach((vn) => {
      const senior = seniors.find((s) => s.id === vn.seniorId) || seniors[0];
      list.push({
        id: `voice-${vn.id}`,
        kind: 'voice_note',
        senderName: senior?.name || 'Senior',
        title: `Voice Check-in: ${senior?.name || 'Senior'}`,
        preview: vn.plainSummary || 'Recorded voice check-in transcript',
        timestamp: vn.timestamp,
        isRead: true,
        cues: vn.extractedCues,
        durationSeconds: vn.durationSeconds,
      });
    });

    // System Notifications
    roleNotifications.forEach((rn) => {
      list.push({
        id: `notif-${rn.id}`,
        kind: 'system',
        senderName: 'System Alert',
        title: rn.title,
        preview: rn.message,
        timestamp: rn.timestamp,
        isRead: rn.read,
      });
    });

    // Sort newest first
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [voiceNotes, roleNotifications, seniors]);

  // Filter items
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      if (filterTab === 'all') return true;
      if (filterTab === 'voice_notes') return item.kind === 'voice_note';
      if (filterTab === 'family') return item.kind === 'family';
      if (filterTab === 'system') return item.kind === 'system';
      return true;
    });
  }, [combinedItems, filterTab]);

  const activeItem = useMemo(() => {
    if (!selectedItemId && filteredItems.length > 0) return filteredItems[0];
    return filteredItems.find((i) => i.id === selectedItemId) || filteredItems[0] || null;
  }, [selectedItemId, filteredItems]);

  const handleSelectItem = (item: any) => {
    setSelectedItemId(item.id);
    if (item.kind === 'system' && !item.isRead) {
      const realId = item.id.replace('notif-', '');
      markNotificationRead(realId);
    }
  };

  const handlePlayVoice = (id: string) => {
    setPlayingVoiceId(id);
    showToast('Playing audio check-in recording (simulated speech).', 'info');
    setTimeout(() => setPlayingVoiceId(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-forest tracking-tight">
            {t.coordInbox}
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Voice notes, family inquiries and system alerts
          </p>
        </div>

        {/* Filter Tabs */}
        <SegmentedTabs
          tabs={[
            { id: 'all', label: 'All', count: combinedItems.length },
            { id: 'voice_notes', label: t.voiceNotes, count: combinedItems.filter((i) => i.kind === 'voice_note').length },
            { id: 'family', label: t.familyMessages, count: combinedItems.filter((i) => i.kind === 'family').length },
            { id: 'system', label: t.systemAlerts, count: combinedItems.filter((i) => i.kind === 'system').length },
          ]}
          activeTab={filterTab}
          onChange={(tab) => setFilterTab(tab as any)}
        />
      </div>

      {/* Two-Pane Layout on Laptop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-2">
              <Inbox className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-bold text-ink">No messages</h4>
              <p className="text-xs text-ink-muted max-w-xs mx-auto">
                No items in this inbox category. Incoming voice notes and family messages will appear here.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'bg-cream border-forest shadow-xs ring-1 ring-forest'
                      : 'bg-cream border-border hover:border-forest/40 hover:bg-mint-deep/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <InitialsAvatar name={item.senderName} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-forest uppercase tracking-wider truncate">
                          {item.senderName}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!item.isRead && (
                            <span
                              className="w-2 h-2 rounded-full bg-alert-red"
                              title={t.unreadLabel}
                              aria-label={t.unreadLabel}
                            />
                          )}
                          <span className="text-[10px] text-ink-muted">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-ink truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-ink-muted truncate mt-0.5">
                        {item.preview}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 self-center hidden lg:block" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <article className="bg-cream border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={activeItem.senderName} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-ink">{activeItem.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
                      <span className="font-semibold text-forest">{activeItem.senderName}</span>
                      <span>:</span>
                      <span>{new Date(activeItem.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>

                {activeItem.kind === 'voice_note' && (
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(activeItem.id)}
                    className="min-h-[40px] px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{playingVoiceId === activeItem.id ? 'Playing...' : 'Play Audio'}</span>
                  </button>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-forest uppercase tracking-wider">
                  {activeItem.kind === 'voice_note' ? 'Transcript & Summary' : 'Message Body'}
                </div>

                <div className="bg-white p-4 rounded-xl border border-border text-sm text-ink leading-relaxed">
                  {activeItem.preview}
                </div>

                {activeItem.cues && activeItem.cues.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                      Extracted Indic Cues
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeItem.cues.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-bold bg-mint-deep text-forest border border-border uppercase"
                        >
                          {c.tag} ({c.severity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ) : (
            <div className="bg-cream border border-border rounded-2xl p-12 text-center text-xs text-ink-muted">
              Select a message from the list to view its complete content and audio transcript.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
