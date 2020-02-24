import { IUnitOfWork, IGuideRepository, IRatingRepository, IUserRepository, ITagRepository } from '../../core/contracts';
import { GuideRepository, UserRepository, TagRepository, RatingRepository } from './repositories';

export class UnitOfWork implements IUnitOfWork {
    constructor(
        public readonly guides: IGuideRepository = new GuideRepository(),
        public readonly users: IUserRepository = new UserRepository(),
        public readonly tags: ITagRepository = new TagRepository(),
        public readonly ratings: IRatingRepository = new RatingRepository()
        ) {

    }

}