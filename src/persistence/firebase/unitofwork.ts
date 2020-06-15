import { IUnitOfWork, IGuideRepository, IRatingRepository, IUserRepository, ITagRepository, ITrackRepository } from '../../core/contracts';
import { GuideRepository, UserRepository, TagRepository, RatingRepository } from './repositories';
import { auth, firestore } from 'firebase-admin';
import { TrackRepository } from './repositories/track.repository';

export class UnitOfWork implements IUnitOfWork {
    public readonly guides: IGuideRepository;
    public readonly users: IUserRepository;
    public readonly tags: ITagRepository;
    public readonly ratings: IRatingRepository;
    public readonly tracks: ITrackRepository;

    constructor(db: firestore.Firestore) {
        this.guides = new GuideRepository(db);
        this.users = new UserRepository(db);
        this.tags = new TagRepository(db);
        this.ratings = new RatingRepository(db);
        this.tracks = new TrackRepository(db);
    }


}