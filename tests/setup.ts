import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";

import { UnitOfWork } from '../src/persistence/mongo/unitofwork';
import { IDataInitializer } from '../src/core/contracts';
import { DbDataInitializer } from '../src/persistence/initializers';

let mongoMemoryServer: MongoMemoryServer;
let unitOfWork: UnitOfWork;
let dataInitializer: IDataInitializer;

//Establish the connection to the in-memory MongoDB Database before running any test 
//and create our UnitOfWork and the DataInitializer
beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    unitOfWork = new UnitOfWork(mongoose.connection);
    dataInitializer = new DbDataInitializer(unitOfWork);
}); 

//Clear the database before each test and fill it up with test values again
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }

    const result: number = await dataInitializer.initData();
});

//Stop the MongoMemoryServer and close the database connection after all tests have concluded
afterAll(async () => {
    await mongoMemoryServer.stop();
    await mongoose.connection.close();
});