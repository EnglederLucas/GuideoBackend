import { IGuideRepository, IRatingRepository, ITagRepository, ITrackRepository, IUnitOfWork, IUserRepository } from '../../core/contracts';
import { GuideRepository, RatingRepository, TagRepository, UserRepository, TrackRepository } from './repositories';

export class UnitOfWork implements IUnitOfWork {
    public readonly guides: IGuideRepository;
    public readonly tags: ITagRepository;
    public readonly users: IUserRepository;
    public readonly ratings: IRatingRepository;
    public readonly tracks: ITrackRepository;

    constructor() {
        this.guides = new GuideRepository();
        this.tags = new TagRepository();
        this.users = new UserRepository();
        this.ratings = new RatingRepository();
        this.tracks = new TrackRepository();
    }
}