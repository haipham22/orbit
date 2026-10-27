export type BirthdayCheckPerson = {
  id: string;
  fullName: string;
  dob: string;
  relationship: string | null;
};

export type BirthdayCheckResult = {
  count: number;
  people: BirthdayCheckPerson[];
};

export interface JobProvider {
  readonly name: "none" | "temporal";
  triggerBirthdayCheck(): Promise<BirthdayCheckResult>;
  scheduleBirthdayCheck(): Promise<void>;
}
