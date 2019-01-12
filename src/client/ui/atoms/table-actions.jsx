import {
  Create as CreateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreFromTrashIcon,
  DeleteForever as EraseIcon,
  FilterList as FilterListIcon,
} from '@material-ui/icons';

import { actionTypes } from '@constants/table';
import {
  getAction,
  hasEmptyRows,
  hasSingleRow,
  hasOneOrManyRows,
} from '@lib/table-helpers';

const { CREATE, FILTER, RESTORE, DELETE, EDIT, ERASE } = actionTypes;

const items = {
  CREATE: {
    id: CREATE,
    name: 'Create',
    title: 'Добавить',
    Icon: CreateIcon,
    rowNumericatyShowPrediacate: hasEmptyRows,
  },

  FILTER: {
    id: FILTER,
    name: 'Filter',
    title: 'Фильтр',
    Icon: FilterListIcon,
    rowNumericatyShowPrediacate: hasEmptyRows,
  },

  EDIT: {
    id: EDIT,
    name: 'Edit',
    title: 'Изменить',
    Icon: EditIcon,
    rowNumericatyShowPrediacate: hasSingleRow,
  },

  DELETE: {
    id: DELETE,
    name: 'Delete',
    title: 'Удалить',
    Icon: DeleteIcon,
    rowNumericatyShowPrediacate: hasOneOrManyRows,
  },

  RESTORE: {
    id: RESTORE,
    name: 'Restore',
    title: 'Восстановить',
    Icon: RestoreFromTrashIcon,
    rowNumericatyShowPrediacate: hasOneOrManyRows,
  },
  ERASE: {
    id: ERASE,
    name: 'Erase',
    title: 'Стереть',
    Icon: EraseIcon,
    rowNumericatyShowPrediacate: hasOneOrManyRows,
  },
};

export const Create = getAction(items.CREATE);
export const Filter = getAction(items.FILTER);
export const Edit = getAction(items.EDIT);
export const Delete = getAction(items.DELETE);
export const Restore = getAction(items.RESTORE);
export const Erase = getAction(items.ERASE);
