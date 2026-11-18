-- ============================================
-- Seed Data: Realistic fake data
-- 2 teams, 6 members, 4 weeks of check-ins, 1 flag
-- ============================================

-- Note: Run this AFTER creating test users in Supabase Auth.
-- The UUIDs below are placeholders — replace with actual auth.users IDs
-- after creating test accounts via the Supabase dashboard or sign-up flow.

-- For now, we'll use a function to insert seed data
-- that references real auth users once they exist.

-- ============================================
-- WORKSPACE
-- ============================================
-- Insert workspace (will reference first user as creator after auth setup)
insert into public.workspaces (id, name) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ArtCenter Design Studio');

-- ============================================
-- TEAMS
-- ============================================
insert into public.teams (id, workspace_id, name) values
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Team Spark'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Team Nova');

-- ============================================
-- After creating users via Auth, run this to seed memberships and check-ins:
-- ============================================

-- Example seed check-ins (run after auth users exist):
/*
-- MEMBERSHIPS (6 members across 2 teams)
insert into public.memberships (profile_id, team_id, workspace_id, role) values
  ('<user1_id>', '11111111-...', 'a1b2c3d4-...', 'lead'),
  ('<user2_id>', '11111111-...', 'a1b2c3d4-...', 'member'),
  ('<user3_id>', '11111111-...', 'a1b2c3d4-...', 'member'),
  ('<user4_id>', '22222222-...', 'a1b2c3d4-...', 'lead'),
  ('<user5_id>', '22222222-...', 'a1b2c3d4-...', 'member'),
  ('<user6_id>', '22222222-...', 'a1b2c3d4-...', 'member');

-- CHECK-INS (4 weeks worth)
insert into public.check_ins (author_id, team_id, body, mood, created_at) values
  ('<user1_id>', '11111111-...', 'Finished the onboarding flow wireframes. Feeling good about the direction.', 'great', now() - interval '21 days'),
  ('<user2_id>', '11111111-...', 'Struggled with the color palette today, went through five iterations.', 'okay', now() - interval '21 days'),
  ('<user1_id>', '11111111-...', 'User testing went well. Three out of five participants completed the flow without help.', 'good', now() - interval '14 days'),
  ('<user3_id>', '11111111-...', 'Having trouble keeping up with the sprint. The component library is taking longer than expected.', 'struggling', now() - interval '14 days'),
  ('<user1_id>', '11111111-...', 'Presented the mid-fi prototype to the class. Got great feedback on the interaction design.', 'great', now() - interval '7 days'),
  ('<user2_id>', '11111111-...', 'Finally nailed the animation timing for the tab bar. Spring physics feel natural now.', 'good', now() - interval '7 days'),
  ('<user1_id>', '11111111-...', 'Sprint review today. We are on track for the presentation next week.', 'good', now()),
  ('<user4_id>', '22222222-...', 'Set up the design system tokens in Figma. Ready for handoff.', 'great', now() - interval '21 days'),
  ('<user5_id>', '22222222-...', 'First time using Expo Router. The file-based routing clicked after reading the docs twice.', 'good', now() - interval '14 days'),
  ('<user6_id>', '22222222-...', 'Missed the standup. Need to communicate better when I am running behind.', 'okay', now() - interval '7 days');

-- HEALTH SCORES
insert into public.health_scores (team_id, score, week_of, notes) values
  ('11111111-...', 8, current_date - interval '21 days', 'Strong start, good energy'),
  ('11111111-...', 7, current_date - interval '14 days', 'Some blockers but pushing through'),
  ('11111111-...', 9, current_date - interval '7 days', 'Great progress on prototype'),
  ('11111111-...', 8, current_date, 'On track for presentation'),
  ('22222222-...', 7, current_date - interval '21 days', 'Getting oriented'),
  ('22222222-...', 6, current_date - interval '14 days', 'Learning curve with new tools'),
  ('22222222-...', 7, current_date - interval '7 days', 'Communication needs work'),
  ('22222222-...', 8, current_date, 'Improving steadily');

-- FLAG (at least one)
insert into public.flags (check_in_id, raised_by, reason, status) values
  ('<checkin_id_struggling>', '<user1_id>', 'Team member reported struggling with sprint pace. May need workload adjustment.', 'acknowledged');

-- SUPPORT ACTION
insert into public.support_actions (flag_id, assigned_to, action, status) values
  ('<flag_id>', '<user1_id>', 'Schedule a one-on-one to discuss workload and re-prioritize tasks for next sprint.', 'in_progress');
*/
