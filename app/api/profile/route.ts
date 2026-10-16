// ==============================================================================
// ASCEND - USER PROFILE API
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ARCHETYPES } from '@/lib/progression/archetypes';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [profileRes, attrRes, streakRes, inventoryRes, userAchRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('attributes').select('*').eq('user_id', user.id).single(),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('inventory').select('*, items(*)').eq('user_id', user.id),
      supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', user.id),
    ]);

    return NextResponse.json({
      profile: profileRes.data,
      attributes: attrRes.data,
      streak: streakRes.data,
      inventory: inventoryRes.data,
      achievements: userAchRes.data,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = ['username', 'archetype', 'avatar_url', 'title', 'theme', 'sound_enabled', 'timezone'];
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // If archetype changed, update avatar accordingly
    if (body.archetype && ARCHETYPES[body.archetype]) {
      updateData.avatar_url = ARCHETYPES[body.archetype].avatar;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profile });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
