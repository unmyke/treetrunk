import uuidv4 from 'uuid/v4';
import container from '@container';
import request from '@infra/support/test/request';

const {
  entities: {
    SellerManagement: {
      entities: { Post },
    },
  },
  commonTypes: { PostId, Day },
  repositories: {
    SellerManagement: { Seller: sellerRepo, Post: postRepo },
  },
} = container;

describe('interfaces :: http :: controllers :: Post :: Posts', () => {
  afterEach(() => {
    return postRepo.clear();
  });

  describe('API :: GET /', () => {
    // query: {
    //   active: false/true,
    //   hasPieceRate: false/true
    // }

    // test DTO objects
    const pieceRatesDTO = [{ value: 1, date: '2018-01-01T00:00:00.000+08:00' }];

    const activePostWithPieceRatesDTO = {
      postId: uuidv4(),
      name: 'Флорист',
      pieceRate: 1,
      pieceRates: pieceRatesDTO,
      state: 'active',
    };
    const activePostWithoutPieceRatesDTO = {
      postId: uuidv4(),
      name: 'Старший флорист',
      pieceRates: [],
      state: 'active',
    };
    const deletedPostWithPieceRatesDTO = {
      postId: uuidv4(),
      name: 'Цветочник',
      pieceRate: 1,
      pieceRates: pieceRatesDTO,
      state: 'deleted',
    };
    const deletedPostWithoutPieceRatesDTO = {
      postId: uuidv4(),
      name: 'Старший цветочник',
      pieceRates: [],
      state: 'deleted',
    };

    // test aggregates
    const pieceRates = [
      {
        value: pieceRatesDTO[0].value,
        day: new Day({ value: new Date(pieceRatesDTO[0].date) }),
      },
    ];

    const activePostWithPieceRates = new Post({
      postId: new PostId({ value: activePostWithPieceRatesDTO.postId }),
      name: activePostWithPieceRatesDTO.name,
      state: activePostWithPieceRatesDTO.state,
    });
    activePostWithPieceRates.setPieceRates(pieceRates);

    const activePostWithoutPieceRates = new Post({
      postId: new PostId({ value: activePostWithoutPieceRatesDTO.postId }),
      name: activePostWithoutPieceRatesDTO.name,
      state: activePostWithoutPieceRatesDTO.state,
    });

    const deletedPostWithPieceRates = new Post({
      postId: new PostId({ value: deletedPostWithPieceRatesDTO.postId }),
      name: deletedPostWithPieceRatesDTO.name,
      state: deletedPostWithPieceRatesDTO.state,
    });
    deletedPostWithPieceRates.setPieceRates(pieceRates);

    const deletedPostWithoutPieceRates = new Post({
      postId: new PostId({ value: deletedPostWithoutPieceRatesDTO.postId }),
      name: deletedPostWithoutPieceRatesDTO.name,
      state: deletedPostWithoutPieceRatesDTO.state,
    });

    const seedRepoPromiseAllPosts = Promise.all([
      postRepo.add(activePostWithPieceRates),
      postRepo.add(activePostWithoutPieceRates),
      postRepo.add(deletedPostWithPieceRates),
      postRepo.add(deletedPostWithoutPieceRates),
    ]);

    const seedRepoPromiseInactivePosts = Promise.all([
      postRepo.add(deletedPostWithPieceRates),
      postRepo.add(deletedPostWithoutPieceRates),
    ]);

    context('when passed invalid props', () => {
      beforeEach(() => {
        return seedRepoPromiseAllPosts;
      });

      test('should return 200 with empty array', async () => {
        const { statusCode, body } = await request().get(
          '/api/posts?test=false'
        );

        expect(statusCode).toBe(200);
        expect(body).toHaveLength(0);
      });
    });

    context('when passed no props', () => {
      context('when there are persisted active posts', () => {
        beforeEach(() => {
          return seedRepoPromiseAllPosts;
        });

        test('should return 200 with array of all active posts', async () => {
          const { statusCode, body } = await request().get('/api/posts');

          expect(statusCode).toBe(200);
          expect(body).toHaveLength(2);
          expect(body[0]).toEqual(activePostWithPieceRatesDTO);
          expect(body[1]).toEqual(activePostWithoutPieceRatesDTO);
        });
      });

      context('when there is no persisted active posts', () => {
        beforeEach(() => {
          return seedRepoPromiseInactivePosts;
        });

        test('should return 200 with empty array', async () => {
          const { statusCode, body } = await request().get('/api/posts');

          expect(statusCode).toBe(200);
          expect(body).toHaveLength(0);
        });
      });
    });

    context('when passed valid props', () => {
      context('when there are persisted filtered posts', () => {
        context('when passed { active: false } query', () => {
          test('should return 200 with array of deleted posts', async () => {});
        });

        context('when passed { hasPieceRates: false } query', () => {
          test('should return 200 with array of posts without piece rates', async () => {});
        });

        context(
          'when passed { active: false, hasPieceRates: false } query',
          () => {
            test('should return 200 with array of deleted posts without piece rates', async () => {});
          }
        );
      });

      context('when there is no persisted filtered posts', () => {
        test('should return 200 with empty array', async () => {});
      });
    });
  });

  describe('API :: POST /', () => {
    // body: { name }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when there is a post with same props', () => {
        test('should return 409 with NOT_ALLOWED error json', async () => {});
      });

      context('when there is no posts with same props', () => {
        test('should add post, return 200 and return post json ', async () => {});
      });
    });
  });

  describe('API :: GET /:postId', () => {
    // params: { postId }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when post with passed postId does not exists', () => {
        test('should return 404 with NOT_FOUND error json', async () => {});
      });

      context('when post with passed postId exists', () => {
        context('when passed postId is quitPostId', () => {
          test('should return 409 with NOT_ALLOWED error json', async () => {});
        });

        context('when passed postId belongs to regular post', () => {
          test('should return 202 with post json', async () => {});
        });
      });
    });
  });

  describe('API :: PUT /:postId', () => {
    // params: { postId }
    // body: { name }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when post with passed postId does not exists', () => {
        test('should return 404 with NOT_FOUND error json', async () => {});
      });

      context('when post with passed postId exists', () => {
        context('when passed postId is quitPostId', () => {
          test('should return 409 with NOT_ALLOWED error json', async () => {});
        });

        context('when passed postId belongs to regular post', () => {
          context("when passed props to update equal post's props", () => {
            test('should return 400 with NOTHING_TO_UPDATE error json', async () => {});
          });

          context("when passed props to update not equal post's props", () => {
            context('when there is a post with same props', () => {
              test('should return 409 with NOT_ALLOWED error json', async () => {});
            });

            context('when there are no posts with same props', () => {
              test('should update post, return 200 and return post json ', async () => {});
            });
          });
        });
      });
    });
  });

  describe('API :: DELETE /:postId', () => {
    // params: { postId }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when post with passed postId does not exists', () => {
        test('should return 404 with NOT_FOUND error json', async () => {});
      });

      context('when post with passed postId exists', () => {
        context('when passed postId is quitPostId', () => {
          test('should return 409 with NOT_ALLOWED error json', async () => {});
        });

        context('when passed postId belongs to regular post', () => {
          context('when there are active sellers appointed to post', () => {
            test('should return 409 with NOT_ALLOWED error json', async () => {});
          });

          context('when there are no sellers appointed to post', () => {
            test('should set post to deleted state and return 200 with empty json', async () => {});
          });
        });
      });
    });
  });

  describe('API :: POST /:postId/piece_rates', () => {
    // params: { postId }
    // body: {
    //   pieceRate: { value, date }
    // }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when post with passed postId does not exists', () => {
        test('should return 404 with NOT_FOUND error json', async () => {});
      });

      context('when post with passed postId exists', () => {
        context('when passed postId is quitPostId', () => {
          test('should return 409 with NOT_ALLOWED error json', async () => {});
        });

        context('when passed postId belongs to regular post', () => {
          context('when piece rate at passed day already added', () => {
            test('should return 409 with NOT_ALLOWED error json', async () => {});
          });

          context('when piece rate at passed day not  added', () => {
            context('when previous persisted value equals passed value', () => {
              test('should return 409 with NOT_ALLOWED error json', async () => {});
            });

            context('when next persisted value equals passed value', () => {
              test('should return 409 with NOT_ALLOWED error json', async () => {});
            });

            context(
              'when passed value is not equals previous and next persisted values',
              () => {
                test('should add piece rate and return 202 with updated post json', async () => {});
              }
            );
          });
        });
      });
    });
  });

  describe('API :: DELETE /:postId/piece_rates', () => {
    // params: { postId }
    // body: {
    //   pieceRate: { value, date }
    // }

    context('when passed invalid props', () => {
      test('should return 400 with VALIDATION_ERROR error json', async () => {});
    });

    context('when passed valid props', () => {
      context('when post with passed postId does not exists', () => {
        test('should return 404 with NOT_FOUND error json', async () => {});
      });

      context('when post with passed postId exists', () => {
        context('when passed postId is quitPostId', () => {
          test('should return 409 with NOT_ALLOWED error json', async () => {});
        });

        context('when passed postId belongs to regular post', () => {
          context('when passed piece rate does not exist', () => {
            test('should return 404 with NOT_FOUND error json', async () => {});
          });

          context('when passed piece rate exists', () => {
            context(
              'when previous persisted value equals next persisted value',
              () => {
                test('should return 409 with NOT_ALLOWED error json', async () => {});
              }
            );

            context(
              'when previous persisted value not equals next persisted value',
              () => {
                test('should delete piece rate and return 202 with updated post json', async () => {});
              }
            );
          });
        });
      });
    });
  });
});
