import { Router } from 'express';
import { inject } from '../../utils/bottle-express';
import Status from 'http-status';

const PostsController = {
  get router() {
    const router = Router();

    // router.use(inject('serializers.post'));

    router.get(
      '/',
      inject('SellerManagement', 'Post', 'getAllPosts'),
      this.index
    );
    router.get(
      '/:postId',
      inject('SellerManagement', 'Post', 'getPost'),
      this.show
    );
    router.post(
      '/',
      inject('SellerManagement', 'Post', 'createPost'),
      this.create
    );
    router.put(
      '/:postId',
      inject('SellerManagement', 'Post', 'updatePost'),
      this.update
    );
    router.delete(
      '/:postId',
      inject('SellerManagement', 'Post', 'deletePost'),
      this.delete
    );
    router.post(
      '/:postId/piece_rates',
      inject('SellerManagement', 'Post', 'createPostPieceRate'),
      this.createPieceRate
    );
    router.put(
      '/:postId/piece_rates',
      inject('SellerManagement', 'Post', 'updatePostPieceRate'),
      this.updatePieceRate
    );
    router.delete(
      '/:postId/piece_rates',
      inject('SellerManagement', 'Post', 'deletePostPieceRate'),
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
    const {
      SUCCESS,
      VALIDATION_ERROR,
      ALREADY_EXISTS,
      ERROR,
    } = createPost.outputs;

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
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createPost.execute(req.body);
  },

  update(req, res, next) {
    const { updatePost } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = updatePost.outputs;

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
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
          details: error.details,
        });
      })
      .on(ERROR, next);

    updatePost.execute({ postIdValue: req.params.postId, ...req.body });
  },

  delete(req, res, next) {
    const { deletePost } = req;
    const { SUCCESS, NOT_FOUND, NOT_ALLOWED, ERROR } = deletePost.outputs;

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
      .on(NOT_ALLOWED, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'NotAllowedError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    deletePost.execute({ postIdValue: req.params.postId });
  },

  createPieceRate(req, res, next) {
    const { createPostPieceRate } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = createPostPieceRate.outputs;

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
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ALREADY_EXISTS, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExists',
          details: error.details,
        });
      })
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createPostPieceRate.execute({
      postIdValue: req.params.postId,
      ...req.body,
    });
  },

  updatePieceRate(req, res, next) {
    const { updatePostPieceRate } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOTHING_TO_UPDATE,
      NOT_FOUND,
      ERROR,
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
      .on(NOTHING_TO_UPDATE, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'NothingToUpdate',
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

    updatePostPieceRate.execute({
      postIdValue: req.params.postId,
      ...req.body,
    });
  },

  deletePieceRate(req, res, next) {
    const { deletePostPieceRate } = req;
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ERROR,
    } = deletePostPieceRate.outputs;

    deletePostPieceRate
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

    deletePostPieceRate.execute({
      postIdValue: req.params.postId,
      ...req.body,
    });
  },
};

export { PostsController };
