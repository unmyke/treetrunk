import React from 'react';
import { headerTypes } from 'constants/table';
import {
  Create,
  Filter,
  Edit,
  Delete,
  Restore,
  Erase,
} from 'ui/atoms/table-actions';
import { getIsInStatesPredicate } from 'lib/table-helpers';
import states from './states';
import {
  createSeller,
  updateSeller,
  deleteSeller,
  restoreSeller,
  eraseSeller,
} from '../api';

const isAnyState = getIsInStatesPredicate();
const isDeleted = getIsInStatesPredicate([states.DELETED]);
const isDismissed = getIsInStatesPredicate([states.DISMISSED]);

const CreateAction = ({ rows }) => (
  <Create rows={rows} showPrediacate={isAnyState} mutation={createSeller} />
);
const FilterAction = ({ rows }) => (
  <Filter rows={rows} showPrediacate={isAnyState} />
);
const EditAction = ({ rows }) => (
  <Edit rows={rows} showPrediacate={isAnyState} mutation={updateSeller} />
);
const DeleteAction = ({ rows }) => (
  <Delete rows={rows} showPrediacate={isDismissed} mutation={deleteSeller} />
);
const RestoreAction = ({ rows }) => (
  <Restore rows={rows} showPrediacate={isDeleted} mutation={restoreSeller} />
);
const EraseAction = ({ rows }) => (
  <Erase rows={rows} showPrediacate={isDeleted} mutation={eraseSeller} />
);

export const table = {
  name: 'Сотрудники',
  defaultOrderBy: 'fullName',
  headers: [
    {
      id: 'fullName',
      type: headerTypes.STRING,
      disablePadding: true,
      label: 'ФИО',
      description: 'Фамилия Имя Отчество',
    },
    {
      id: 'phone',
      type: headerTypes.STRING,
      disablePadding: false,
      label: 'Телефон',
      description: 'Номер телефона',
    },
    {
      id: 'post',
      type: headerTypes.STRING,
      disablePadding: false,
      label: 'Должность',
      description: 'Текщая должность сотрудника',
    },
    {
      id: 'pieceRate',
      type: headerTypes.FLOAT,
      disablePadding: false,
      label: 'Процент от продаж (%)',
      description: 'Процент от продаж по должности',
    },
    {
      id: 'seniority',
      type: headerTypes.INTEGER,
      disablePadding: false,
      label: 'Стаж (мес.)',
      description: 'Стаж в месяцах',
    },
    {
      id: 'award',
      type: headerTypes.FLOAT,
      disablePadding: false,
      label: 'Надбавка за стаж (руб.)',
      description: 'Стаж в месяцах',
    },
  ],
  actions: [
    CreateAction,
    FilterAction,
    EditAction,
    DeleteAction,
    RestoreAction,
    EraseAction,
  ],
};
