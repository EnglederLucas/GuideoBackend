import { IUnitOfWork, IGuideRepository, IRatingRepository, IUserRepository, ITagRepository } from '../../core/contracts';
import { GuideRepository, UserRepository, TagRepository, RatingRepository } from './repositories';
import { auth, firestore } from 'firebase-admin';

export class UnitOfWork implements IUnitOfWork {
    public readonly guides: IGuideRepository;
    public readonly users: IUserRepository;
    public readonly tags: ITagRepository;
    public readonly ratings: IRatingRepository;

    constructor(db: firestore.Firestore, fbAuth: auth.Auth) {
        this.guides = new GuideRepository(db);
        this.users = new UserRepository(db, fbAuth);
        this.tags = new TagRepository(db);
        this.ratings = new RatingRepository(db);
    }


}