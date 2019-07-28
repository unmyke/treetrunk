import { subMonths, startOfDay } from 'date-fns';

import * as commonTypes from '../../../common-types';
import { PostSerializer as Serializer } from './post';
import { Post } from '@domain/entities/seller-management';
import { PostId, Day } from '@domain/common-types';
import { Post as states } from '@domain/states';

const today = startOfDay(new Date());
const date1 = subMonths(today, 3);
const date2 = subMonths(today, 2);

const value1 = 1.0;
const value2 = 1.5;

const day1 = new Day({ value: date1 });
const day2 = new Day({ value: date2 });

const pieceRate1 = { value: value1, day: day1 };
const pieceRate2 = { value: value2, day: day2 };

const pieceRates1 = [];
const pieceRates2 = [pieceRate1];
const pieceRates3 = [pieceRate1, pieceRate2];

const postId = new PostId();
const name = 'Post';

const commonRestorePostProps = {
  postId,
  name,
};

const postRestoreProps1 = {
  ...commonRestorePostProps,
  state: states.ACTIVE,
  pieceRates: pieceRates1,
};
const postRestoreProps2 = {
  ...commonRestorePostProps,
  state: states.ACTIVE,
  pieceRates: pieceRates2,
};
const postRestoreProps3 = {
  ...commonRestorePostProps,
  state: states.DELETED,
  pieceRates: pieceRates3,
};

const commonSerializedPost = {
  id: commonRestorePostProps.postId.value,
  name: commonRestorePostProps.name,
};
const newSerializedPost = {
  ...commonSerializedPost,
  state: postRestoreProps1.state,
  piece_rate: null,
  piece_rates: [],
};
const recruitedSerializedPost1 = {
  ...commonSerializedPost,
  state: postRestoreProps2.state,
  piece_rate: value1,
  piece_rates: [{ value: value1, day: date1.toString() }],
};
const recruitedSerializedPost2 = {
  ...commonSerializedPost,
  state: postRestoreProps3.state,
  piece_rate: value2,
  piece_rates: [
    { value: value1, day: date1.toString() },
    { value: value2, day: date2.toString() },
  ],
};
const serializer = new Serializer({ commonTypes });

describe('interfaces :: serializers :: PostManagement :: Post', () => {
  let post, postRestoreProps, serializedPost;

  beforeEach(() => {});

  context('when passed new post', () => {
    beforeEach(() => {
      postRestoreProps = postRestoreProps1;

      post = Post.restore(postRestoreProps);
      serializedPost = newSerializedPost;
    });

    test('should return post DTO', () => {
      expect(serializer.toDTO(post)).toEqual(serializedPost);
    });
  });

  context('when passed post with one piece rate', () => {
    beforeEach(() => {
      postRestoreProps = postRestoreProps2;

      post = Post.restore(postRestoreProps);
      serializedPost = recruitedSerializedPost1;
    });

    test('should return post DTO', () => {
      expect(serializer.toDTO(post)).toEqual(serializedPost);
    });
  });

  context('when passed post with two piece rate', () => {
    beforeEach(() => {
      postRestoreProps = postRestoreProps3;

      post = Post.restore(postRestoreProps);
      serializedPost = recruitedSerializedPost2;
    });

    test('should return post DTO', () => {
      expect(serializer.toDTO(post)).toEqual(serializedPost);
    });
  });
});
