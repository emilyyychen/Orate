export interface Take {
  id: string;
  lessonId: string;
  date: string;
  score: number;
  durationSec: number;
  wordsPerMinute: number;
  pauses: number;
  fillerWords: number;
  label: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const MOCK_TAKES: Take[] = [
  { id: '1', lessonId: 'pause', date: '2026-11-14', score: 78, durationSec: 97, wordsPerMinute: 142, pauses: 6, fillerWords: 3, label: 'Pause practice' },
  { id: '2', lessonId: 'numbers', date: '2026-11-13', score: 85, durationSec: 124, wordsPerMinute: 136, pauses: 8, fillerWords: 1, label: 'Number placement' },
  { id: '3', lessonId: 'story', date: '2026-11-12', score: 62, durationSec: 180, wordsPerMinute: 155, pauses: 4, fillerWords: 7, label: 'Storytelling arc' },
  { id: '4', lessonId: 'pause', date: '2026-11-10', score: 71, durationSec: 88, wordsPerMinute: 148, pauses: 5, fillerWords: 4, label: 'Pause practice' },
  { id: '5', lessonId: 'confidence', date: '2026-11-08', score: 90, durationSec: 110, wordsPerMinute: 130, pauses: 9, fillerWords: 0, label: 'Vocal confidence' },
];

export const LESSONS: Lesson[] = [
  { id: 'pause', title: 'Master the art of the pause', subtitle: 'Use silence to emphasize ideas', icon: 'pause-outline', color: '#FFE47B', difficulty: 'intermediate' },
  { id: 'numbers', title: 'Lead with numbers', subtitle: 'Make data hit harder', icon: 'trending-up-outline', color: '#FFEDE6', difficulty: 'beginner' },
  { id: 'story', title: 'Build a story arc', subtitle: 'Hook, build, deliver', icon: 'book-outline', color: '#FFF4CC', difficulty: 'intermediate' },
  { id: 'confidence', title: 'Project vocal confidence', subtitle: 'Tone, pace, and projection', icon: 'mic-outline', color: '#E8F5E9', difficulty: 'beginner' },
  { id: 'structure', title: 'Structure your argument', subtitle: 'Claim, evidence, impact', icon: 'list-outline', color: '#E3F2FD', difficulty: 'advanced' },
  { id: 'filler', title: 'Cut the filler words', subtitle: 'Speak with precision', icon: 'close-circle-outline', color: '#FFF4CC', difficulty: 'beginner' },
];

export const MOCK_GROUPS = [
  {
    label: 'This week',
    takes: MOCK_TAKES.slice(0, 2),
  },
  {
    label: 'Last week',
    takes: MOCK_TAKES.slice(2),
  },
];

export const WEEK_DATA = [
  { day: 'Mon', minutes: 12 },
  { day: 'Tue', minutes: 0 },
  { day: 'Wed', minutes: 8 },
  { day: 'Thu', minutes: 15 },
  { day: 'Fri', minutes: 5 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 0 },
];
