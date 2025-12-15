export interface ScoreBreakdown {
  content: number;
  communicativeAchievement: number;
  organization: number;
  language: number;
}

export interface FeedbackSegment {
  text: string;
  isError: boolean;
  correction?: string;
  explanation?: string;
  type?: 'grammar' | 'vocabulary' | 'spelling' | 'punctuation' | 'style';
}

export interface AnalysisResult {
  scores: ScoreBreakdown;
  totalScore: number;
  generalFeedback: string;
  goodPoints: string[];
  badPoints: string[];
  revisedText: string;
  inlineFeedback: FeedbackSegment[];
}

export const INITIAL_STORY = `When Pat opened the book, an old letter fell out of it. There was his dad wrote that and had 35231.2 pounds in it.

 He saw the letter, that about “How are you today？There are some money, you have to take care of you by yourself.” 

Pat was very sad so he wrote a letter.

Hi dad,
  Well...... I was fine. Look! I married her last year, now I had a son, which was cute. I knew you couldn’t saw that. Secondly could take care of my parents by myself.

I was very missed you. Could you come back? No, I knew you couldn’t.
Love,
Pat`;