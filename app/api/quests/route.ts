// ==============================================================================
// ASCEND - QUESTS API: LIST & CREATE
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDefaultAttributeForCategory } from '@/lib/progression/attributes';
import { DIFFICULTY_REWARDS } from '@/lib/progression/rewards';
import { QuestCategory, QuestDifficulty, AttributeType } from '@/types/rpg';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: quests, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ quests });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description = '',
      category = 'Work',
      difficulty = 'Medium',
      attribute,
      is_recurring = false,
      recurrence_interval = 'Daily',
      recurring_days = null,
      due_date = null,
      priority = 'Medium',
      reminder_time = null,
      reminder_enabled = false,
      timer_minutes = null,
    } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Quest title is required' }, { status: 400 });
    }

    const validCategory = category as QuestCategory;
    const validDifficulty = difficulty as QuestDifficulty;
    const resolvedAttribute = (attribute as AttributeType) || getDefaultAttributeForCategory(validCategory);

    // Server-authoritative baseline rewards calculation
    const baseRewards = DIFFICULTY_REWARDS[validDifficulty] || DIFFICULTY_REWARDS.Medium;

    const { data: quest, error } = await supabase
      .from('quests')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category: validCategory,
        difficulty: validDifficulty,
        attribute: resolvedAttribute,
        xp_reward: baseRewards.xp,
        gold_reward: baseRewards.gold,
        status: 'Active',
        is_recurring,
        recurrence_interval: is_recurring ? recurrence_interval : null,
        recurring_days: is_recurring ? recurring_days : null,
        due_date,
        priority,
        reminder_time,
        reminder_enabled,
        timer_minutes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ quest }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
