import { MONGODB_URI } from './config';

import mongoose from 'mongoose';
import logger from './logger';

class MongoConnection {
  constructor() {
    logger.info('Initialising Mongoose');

    mongoose.Promise = global.Promise;
    const options = {
      useNewUrlParser: true,
      keepAlive: true,
      useUnifiedTopology: true,
    };
    
    const mongoDebugUrl: any = MONGODB_URI;
    mongoose
      .connect(mongoDebugUrl, options)
      .catch(err => logger.error('Failed to connect to MongoDB: %o', err));
    
    /**
     * Registers various connection events.
     *
     * See: https://thecodebarbarian.com/managing-connections-with-the-mongodb-node-driver.html#handling-single-server-outages
     */

    // When the mongodb server goes down, mongoose emits a 'disconnected' event
    mongoose.connection.on('disconnected', () => {
      logger.error(`Mongoose lost connection to url: ${mongoDebugUrl}`);
      process.exit(1);
    });
    // The driver tries to automatically reconnect by default, so when the
    // server starts the driver will reconnect and emit a 'reconnect' event.
    mongoose.connection.on('reconnect', () => {
      logger.info(`Mongoose reconnected to MongoDB url: ${mongoDebugUrl}`);
    });
    // Mongoose will also emit a 'connected' event along with 'reconnect'. These
    // events are interchangeable.
    mongoose.connection.on('connected', async () => {
      logger.info(`Mongoose connected to url: ${mongoDebugUrl}`);
    });
    // This event is unfortunately not bubbled up to the db handle correctly,
    // see https://github.com/mongodb/node-mongodb-native/pull/1545
    // This event is emitted when the driver ran out of `reconnectTries`. At this
    // point you should either crash your app or manually try to reconnect.
    mongoose.connection.on('reconnectFailed', () => {
      logger.error(`Mongoose gave up reconnecting to MongoDB url: ${mongoDebugUrl}. Terminating application.`);
      process.exit(1);
    });
  }
}

export default new MongoConnection();
