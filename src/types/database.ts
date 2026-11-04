export type Lesson = {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula: string;
  explanation: string;
  sort_order: number;
};

export type StudyNote = {
  id: string;
  user_id: string;
  lesson_id: string;
  body: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      lessons: {
        Row: Lesson;
        Insert: Lesson;
        Update: Partial<Lesson>;
        Relationships: [];
      };
      study_notes: {
        Row: StudyNote;
        Insert: Pick<StudyNote, 'user_id' | 'lesson_id' | 'body'> &
          Partial<Pick<StudyNote, 'id' | 'created_at'>>;
        Update: Pick<StudyNote, 'body'>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
