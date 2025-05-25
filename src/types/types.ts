export interface TextContent {
  text: string;
}

export interface Answer {
  text: string;
  fraction: number;
}

export interface Subquestion {
  text: string;
  answer: TextContent;
}

export type QuestionType =
  | 'multichoice'
  | 'truefalse'
  | 'shortanswer'
  | 'numerical'
  | 'matching';

export interface Question {
  type: QuestionType;
  name: TextContent;
  questiontext: TextContent;
  answers?: Answer[];
  subquestions?: Subquestion[];
}