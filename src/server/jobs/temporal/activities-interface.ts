import type { BirthdayCheckResult } from "../types";

export interface BirthdayCheckActivities {
  birthdayCheckActivity(): Promise<BirthdayCheckResult>;
}
