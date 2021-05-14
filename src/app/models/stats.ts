export interface Stats {
  events: number;
  minTimeDelay: number;
  maxTimeDelay: number;
  meanTimeDelay: number;
  longestInputAfterFocusSeq: number;
  totalInteractionTime: string;
  longestFocusTime: string;
  totalClicks: number;
}
