import { Router } from 'express';
import { injectService } from '../../utils/bottle-express';
import Status from 'http-status';

const SellersController = {
  get router() {
    const router = Router();

    // router.use(inject('serializers.seller'));

    router.get('/', injectService('services.getAllSellers'), this.index);
    router.get('/:id', injectService('services.getSeller'), this.show);
    router.post('/', injectService('services.createSeller'), this.create);
    router.put('/:id', injectService('services.updateSeller'), this.update);
    router.delete('/:id', injectService('services.deleteSeller'), this.delete);

    return router;
  },

  index(req, res, next) {
    const { getAllSellers } = req;
    const { SUCCESS, ERROR } = getAllSellers.outputs;

    getAllSellers
      .on(SUCCESS, (sellers) => {
        res.status(Status.OK).json(sellers);
      })
      .on(ERROR, next);

    getAllSellers.execute();
  },

  show(req, res, next) {
    const { getSeller } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getSeller.outputs;

    getSeller
      .on(SUCCESS, (seller) => {
        res.status(Status.OK).json(seller);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    getSeller.execute(Number(req.params.id));
  },

  create(req, res, next) {
    const { createSeller } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createSeller.outputs;

    createSeller
      .on(SUCCESS, (seller) => {
        res.status(Status.CREATED).json(seller);
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details,
        });
      })
      .on(ERROR, next);

    createSeller.execute(req.body);
  },

  update(req, res, next) {
    const { updateSeller } = req;
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR,
      NOT_FOUND,
    } = updateSeller.outputs;

    updateSeller
      .on(SUCCESS, (seller) => {
        res.status(Status.ACCEPTED).json(seller);
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

    updateSeller.execute(Number(req.params.id), req.body);
  },

  delete(req, res, next) {
    const { deleteSeller } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = deleteSeller.outputs;

    deleteSeller
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

    deleteSeller.execute(Number(req.params.id));
  },
};

module.exports = SellersController;
