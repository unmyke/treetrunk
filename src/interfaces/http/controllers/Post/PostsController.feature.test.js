import uuidv4 from 'uuid/v4';

import { container } from 'src/container';
import { request } from 'src/infra/support/test/request';

const {
  subdomains: {
    SellerManagement: {
      entities: { Post, Seller },
    },
  },
  commonTypes: { Day },
  repositories: {
    SellerManagement: { Post: postRepo, Seller: sellerRepo },
  },
} = container;

describe('API :: GET /', () => {
  context('when passed no props', () => {
    context('when there are persisted active posts', () => {
      test('should return 200 with array of all active posts', () => {});
    });

    context('when there is no persisted active posts', () => {
      test('should return 200 with empty array', () => {});
    });
  });

  context('when passed valid props', () => {
    context('when there are persisted filtered posts', () => {
      context('when passed { active: false } query', () => {
        test('should return 200 with array of inactive posts', () => {});
      });

      context('when passed { hasPieceRates: false } query', () => {
        test('should return 200 with array of posts without piece rates', () => {});
      });

      context(
        'when passed { active: false, hasPieceRates: false } query',
        () => {
          test('should return 200 with array of inactive posts without piece rates', () => {});
        }
      );
    });

    context('when there is no persisted filtered posts', () => {
      test('should return 200 with empty array', () => {});
    });
  });

  context('when passed invalid props', () => {
    test('should return 200 with empty array', () => {});
  });
});

describe('API :: POST /', () => {
  context('when passed valid and consistent props', () => {
    test('should add post, return 200 and return post json ', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when there is a post with same props', () => {
      test('should return 409 with NOT_ALLOWED error json', () => {});
    });
  });
});

describe('API :: GET /:postId', () => {
  context('when passed valid and consistent props', () => {
    test('should return 202 with post json', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when passed postId is quitPostId', () => {
      test('should return 409 with NOT_ALLOWED error json', () => {});
    });

    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });
  });
});

describe('API :: PUT /:postId', () => {
  context('when passed valid and consistent props', () => {
    test('should update post, return 200 and return post json ', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });

    context('when post with passed postId exists', () => {
      context('when passed postId is quitPostId', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });

      context('when there is a post with same props', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });
    });
  });
});

describe('API :: DELETE /:postId', () => {
  context('when passed valid and consistent props', () => {
    test('should set post to inactive state and return 200 with empty json', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });

    context('when post with passed postId exists', () => {
      context('when passed postId is quitPostId', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });

      context('when there are active sellers appointed to post', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });
    });
  });
});

describe('API :: POST /:postId/piece_rates', () => {
  context('when passed valid and consistent props', () => {
    test('should add piece rate and return 202 with updated post json', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });

    context('when post with passed postId exists', () => {
      context('when passed postId is quitPostId', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });

      context('when passed piece rate:', () => {
        context('value equals persisted piece rate value before', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });

        context('day equals persisted piece rate day', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });

        context('value equals persisted piece rate value after', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });
      });
    });
  });
});

describe('API :: PUT /:postId/piece_rates', () => {
  context('when passed valid and consistent props', () => {
    test('should update piece rate and return 202 with updated post json', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });

    context('when post with passed postId exists', () => {
      context('when passed postId is quitPostId', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });

      context('when passed current piece rate:', () => {
        context('does not exists', () => {
          test('should return 404 with NOT_FOUND error json', () => {});
        });

        context('value and date equals updated value and date', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });

        context('day have equal persisted values before and after', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });
      });

      context('when passed update piece rate:', () => {
        context('value equals persisted piece rate value before', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });

        context('day equals persisted piece rate day', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });

        context('value equals persisted piece rate value after', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });
      });
    });
  });
});

describe('API :: DELETE /:postId/piece_rates', () => {
  context('when passed valid and consistent props', () => {
    test('should update piece rate and return 202 with updated post json', () => {});
  });

  context('when passed invalid props', () => {
    test('should return 400 with VALIDATION_ERROR error json', () => {});
  });

  context('when passed inconsistent props', () => {
    context('when post with passed postId does not exists', () => {
      test('should return 404 with NOT_FOUND error json', () => {});
    });

    context('when post with passed postId exists', () => {
      context('when passed postId is quitPostId', () => {
        test('should return 409 with NOT_ALLOWED error json', () => {});
      });

      context('when passed piece rate:', () => {
        context('does not exists', () => {
          test('should return 404 with NOT_FOUND error json', () => {});
        });

        context('day have equal persisted values before and after', () => {
          test('should return 409 with NOT_ALLOWED error json', () => {});
        });
      });
    });
  });
});
