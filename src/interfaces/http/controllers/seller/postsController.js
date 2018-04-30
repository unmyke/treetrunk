import { Router } from 'express';
import { injectService } from '../../utils/bottle-express';
import Status from 'http-status';

const PostsController = {
  get router() {
    const router = Router();

    // router.use(inject('serializers.post'));

    router.get('/', injectService('Seller', 'getPosts'), this.index);
    router.get('/:id', injectService('Seller', 'getPost'), this.show);
    router.post('/', injectService('Seller', 'createPost'), this.create);
    router.put('/:id', injectService('Seller', 'updatePost'), this.update);
    router.delete('/:id', injectService('Seller', 'deletePost'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getPosts } = req;
    const { SUCCESS, ERROR } = getPosts.outputs;

    getPosts
      .on(SUCCESS, (posts) => {
        res.status(Status.OK).json(posts);
      })
      .on(ERROR, next);

    getPosts.execute();
  },

  show(req, res, next) {
    const { getPost } = req;
    console.log(getPost);

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

    getPost.execute(Number(req.params.id));
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

    updatePost.execute(Number(req.params.id), req.body);
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

    deletePost.execute(Number(req.params.id));
  },
};

module.exports = PostsController;
