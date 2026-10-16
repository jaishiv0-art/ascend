'use client';

// ==============================================================================
// ASCEND - GLOBAL TASK ALARM & SCHEDULE REMINDER WATCHER
// Background interval monitor with WebAudio Alarm Chime & Active Alarm Modal
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/lib/context/game-context';
import { Quest } from '@/types/rpg';
import { ActiveAlarmModal } from '@/components/modals/ActiveAlarmModal';
import { TaskTimerModal } from '@/components/modals/TaskTimerModal';

export const AlarmWatcher: React.FC = () => {
  const { quests } = useGame();

  const [activeAlarmQuest, setActiveAlarmQuest] = useState<Quest | null>(null);
  const [focusTimerQuest, setFocusTimerQuest] = useState<Quest | null>(null);
  const [snoozedUntil, setSnoozedUntil] = useState<Record<string, number>>({});

  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      const activeQuests = quests.filter((q) => q.status === 'Active');

      for (const quest of activeQuests) {
        if (!quest.reminder_time || quest.reminder_enabled === false) continue;

        // Check if quest has a due_date and if it matches today (or is recurring daily)
        if (quest.due_date && !quest.is_recurring) {
          const questDue = quest.due_date.includes('T') ? quest.due_date.split('T')[0] : quest.due_date;
          if (questDue !== todayDateStr) continue;
        }

        const alarmKey = `${quest.id}-${todayDateStr}-${currentTimeStr}`;

        // Check if snoozed
        const snoozeTimestamp = snoozedUntil[quest.id];
        const isCurrentlySnoozed = snoozeTimestamp && Date.now() < snoozeTimestamp;

        if (isCurrentlySnoozed) continue;

        // Check if alarm time matches current local time
        if (quest.reminder_time === currentTimeStr && !triggeredAlarmsRef.current.has(alarmKey)) {
          triggeredAlarmsRef.current.add(alarmKey);
          setActiveAlarmQuest(quest);
          break; // Trigger one alarm modal at a time
        }
      }
    };

    // Run check immediately and then every 5 seconds
    checkAlarms();
    const interval = setInterval(checkAlarms, 5000);

    return () => clearInterval(interval);
  }, [quests, snoozedUntil]);

  const handleDismiss = () => {
    setActiveAlarmQuest(null);
  };

  const handleSnooze = (questId: string) => {
    setActiveAlarmQuest(null);
    // Snooze for 5 minutes (300,000 ms)
    setSnoozedUntil((prev) => ({
      ...prev,
      [questId]: Date.now() + 5 * 60 * 1000,
    }));
  };

  const handleStartFocus = (quest: Quest) => {
    setActiveAlarmQuest(null);
    setFocusTimerQuest(quest);
  };

  return (
    <>
      {/* Active Alarm Trigger Popup Modal */}
      <ActiveAlarmModal
        quest={activeAlarmQuest}
        isOpen={Boolean(activeAlarmQuest)}
        onDismiss={handleDismiss}
        onSnooze={handleSnooze}
        onStartFocus={handleStartFocus}
      />

      {/* Focus Timer Modal if user initiates focus from alarm */}
      <TaskTimerModal
        quest={focusTimerQuest}
        isOpen={Boolean(focusTimerQuest)}
        onClose={() => setFocusTimerQuest(null)}
      />
    </>
  );
};
