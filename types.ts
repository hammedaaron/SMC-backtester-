
export enum SessionType {
  LONDON = 'London',
  NEW_YORK = 'NY',
  ASIA = 'Asia'
}

export enum Timeframe {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  H1 = '1H',
  H4 = '4H',
  DAILY = 'Daily'
}

export enum Bias {
  BULL = 'Bull',
  BEAR = 'Bear',
  NEUTRAL = 'Neutral'
}

export enum TradeType {
  LONG = 'Long',
  SHORT = 'Short'
}

export enum Result {
  WIN = 'Win',
  LOSS = 'Loss',
  BE = 'Break-even'
}

export interface SMCChecklist {
  premiumDiscount: boolean;
  liquiditySweep: boolean;
  mss: boolean;
  fvg: boolean;
  orderBlock: boolean;
  structureBroken: boolean;
  smtDivergence: boolean;
  [key: string]: boolean; // For custom fields
}

export interface Trade {
  id: string;
  date: string;
  coin: string;
  session: SessionType | string;
  timeframe: Timeframe | string;
  htfTimeframe: Timeframe | string;
  bias: Bias;
  type: TradeType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rr: number;
  setup: SMCChecklist;
  result: Result;
  exitPrice: number;
  pnlPercent: number;
  notes: string;
  lessonSnippet?: string;
  screenshot?: string;
  dayOfWeek: string;
  isPriorityDay: boolean;
  durationMinutes?: number;
}

export interface CustomField {
  id: string;
  label: string;
  active: boolean;
}

export interface AppTemplate {
  coins: string[];
  sessions: string[];
  customConfluences: CustomField[];
  dashboardWidgets: string[]; // IDs of widgets in order
  plannedTradingDays: number[]; // 0-6 (Sun-Sat)
}

export interface User {
  username: string;
  email: string;
  mobile: string;
  timezone: string;
  dailyHourLimit: number;
  lastActiveDay?: string;
  todayMinutes?: number;
  streakCount: number;
  maxStreak: number;
  milestonesReached: string[];
  template: AppTemplate;
  aiEnabled: boolean;
}

export interface AppState {
  trades: Trade[];
  user: User;
}
