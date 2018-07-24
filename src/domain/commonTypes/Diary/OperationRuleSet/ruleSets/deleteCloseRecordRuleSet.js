import { DiaryMustBeClosed } from '../Rules';

const diaryMustBeClosed = new DiaryMustBeClosed();

export const deleteCloseRecordRuleSet = [diaryMustBeClosed];
