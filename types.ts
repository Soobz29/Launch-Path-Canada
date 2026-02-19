export interface QuizState {
  status: string;
  province: string;
  income: string;
  bankAccount: string;
  goal: string;
}

export interface RoadmapAction {
  id: string;
  text: string;
}

export interface RoadmapMonth {
  monthNumber: number;
  title: string;
  actions: RoadmapAction[];
}

export interface CheckIn {
  id: string;
  score: number;
  checkin_date: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  visa_type: string;
  province: string;
  income_bracket: string;
  bank_account_status: string;
  credit_goal: string;
}

export type RoadmapType = RoadmapMonth[];