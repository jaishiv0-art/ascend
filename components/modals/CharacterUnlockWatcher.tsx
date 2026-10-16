'use client';

import React from 'react';
import { useGame } from '@/lib/context/game-context';
import { CharacterUnlockBanner } from '@/components/modals/CharacterUnlockBanner';

export const CharacterUnlockWatcher: React.FC = () => {
  const { unlockedCharacterNotification, closeCharacterNotification, switchArchetype } = useGame();

  if (!unlockedCharacterNotification) return null;

  return (
    <CharacterUnlockBanner
      archetype={unlockedCharacterNotification}
      onClose={closeCharacterNotification}
      onSelectArchetype={(id) => switchArchetype(id)}
    />
  );
};

export default CharacterUnlockWatcher;
