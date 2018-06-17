import { DiaryComposite } from '../../commonTypes';
import { PieceRate } from './PieceRate';

const diaryArgsMap = {
  record: 'pieceRate',
  newRecord: 'newPieceRate',
  newRecords: 'newPieceRates',
};

export class PieceRates extends DiaryComposite {
  constructor() {
    super({ RecordClass: PieceRate, mapper: diaryArgsMap });
  }
}
