import { Router } from 'express';
import { injectService } from '../../utils/bottle-express';
import Status from 'http-status';

const PostsController = {
  get router() {
    const router = Router();

    // router.use(inject('serializers.post'));

    router.get('/', injectService('Post', 'getAllPosts'), this.index);
    router.get('/:postId', injectService('Post', 'getPost'), this.show);
    router.post('/', injectService('Post', 'createPost'), this.create);
    router.put('/:postId', injectService('Post', 'updatePost'), this.update);
    router.delete('/:postId', injectService('Post', 'deletePost'), this.delete);
    router.post(
      '/:postId/piecerates',
      injectService('Post', 'createPostPieceRate'),
      this.createPieceRate
    );
    router.put(
      '/:postId/piecerates',
      injectService('Post', 'updatePostPieceRate'),
      this.updatePieceRate
    );
    router.delete(
      '/:postId/piecerates',
      injectService('Post', 'deletePostPieceRate'),
      this.deletePieceRate
    );

    return router;
  },

  index(req, res, next) {
    const { getAllPosts } = req;
    const { SUCCESS, ERROR } = getAllPosts.outputs;

    getAllPosts
      .on(SUCCESS, (posts) => {
        res.status(Status.OK).json(posts);
      })
      .on(ERROR, next);

    getAllPosts.execute(req.query);
  },

  show(req, res, next) {
    const { getPost } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getPost.outputs;

    getPost
      .on(SUCCESS, (post) => {
        res.status(Status.OK).json(post);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    getPost.execute(req.params.postId);
  },

  create(req, res, next) {
    const { createPost } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createPost.outputs;

    createPost
      .on(SUCCESS, (post) => {
        res.status(Status.CREATED).json(post);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createPost.execute(req.body);
  },

  update(req, res, next) {
    const { updatePost } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updatePost.outputs;

    updatePost
      .on(SUCCESS, (post) => {
        res.status(Status.ACCEPTED).json(post);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    updatePost.execute(req.params.postId, req.body);
  },

  delete(req, res, next) {
    const { deletePost } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = deletePost.outputs;

    deletePost
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    deletePost.execute(req.params.postId);
  },

  createPieceRate(req, res, next) {
    const { createPostPieceRate } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createPostPieceRate.outputs;

    createPostPieceRate
      .on(SUCCESS, (post) => {
        res.status(Status.CREATED).json(post);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createPostPieceRate.execute(req.params.postId, req.body);
  },

  updatePieceRate(req, res, next) {
    const { updatePostPieceRate } = req;
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR,
      NOT_FOUND,
    } = updatePostPieceRate.outputs;

    updatePostPieceRate
      .on(SUCCESS, (post) => {
        res.status(Status.ACCEPTED).json(post);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    updatePostPieceRate.execute(req.params.postId, req.body);
  },

  deletePieceRate(req, res, next) {
    const { deletePostPieceRate } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = deletePostPieceRate.outputs;

    deletePostPieceRate
      .on(SUCCESS, () => {
        res.status(Status.ACCEPTED).end();
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    deletePostPieceRate.execute(req.params.postId), req.body;
  },
};

export { PostsController };
