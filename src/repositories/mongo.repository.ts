import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import logger from '../logger';

class MongoRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  insert(data: T) {
    logger.debug('MongoRepository.insert(%o)', data);
    return this.model.create(data);
  }

  insertMany(data: T[]) {
    logger.debug('MongoRepository.insertMany(%o)', data);
    return this.model.insertMany(data);
  }

  update(id: string | Types.ObjectId, data: UpdateQuery<T>, _new = true) {
    logger.debug('MongoRepository.save(%s, %o)', id, data);
    return this.model.findByIdAndUpdate(id, data, { new: _new }).lean();
  }

  find(query: FilterQuery<T> = {}) {
    logger.debug('MongoRepository.findAll(%s)', query);
    return this.model.find(query).lean();
  }

  findOne(query: FilterQuery<T> = {}) {
    logger.debug('MongoRepository.findOne(%s)', query);
    return this.model.findOne(query);
  }

  findById(id: string) {
    logger.debug('MongoRepository.findById(%s)', id);
    return this.model.findById(id).lean();
  }

  existById(id: string) {
    logger.debug('MongoRepository.existById(%s)', id);
    return this.model.exists({ _id: id })
  }

  deleteById(id: string) {
    logger.debug('MongoRepository.deleteById(%s)', id);
    return this.model.deleteOne({ _id: id });
  }

  deleteMany(query: FilterQuery<T> = {}) {
    logger.debug('MongoRepository.deleteMany(%o)', query);
    return this.model.deleteMany(query);
  }
}

export default MongoRepository;
