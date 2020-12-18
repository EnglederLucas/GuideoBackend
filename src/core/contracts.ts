import { GuideLocationDto } from '../application/data-transfer-objects';
import { IGuide, IRating, ITag, IUser, ITrack } from './models';

export interface IGenericRepository<TEntity, TId> {
    getAll(): Promise<TEntity[]>;
    add(item: TEntity): Promise<string>;
    addRange(items: TEntity[]): Promise<void>;
    getById(id: TId): Promise<TEntity | null>;
}

export interface IRatingRepository extends IGenericRepository<IRating, any> {
    getRatingOfGuideByUser(id: string, uid: string): Promise<IRating | null>;
    update(rating: IRating): Promise<void>;
    getRatingsOfGuide(guideId: string): Promise<IRating[]>;
    getAverageRatingOfGuide(guideId: string): Promise<number>;
    getRatingsOfUser(userId: string): Promise<IRating[]>;
    getSpecificOf(guideId: string, userId: string): Promise<IRating | undefined>;
}

export interface IGuideRepository extends IGenericRepository<IGuide, string> {
    getByRating(rating: number): IGuide[] | PromiseLike<IGuide[]>;
    delete(guideId: string, username: string): Promise<void>;
    getGuidesByName(name: string): Promise<IGuide[]>;
    getGuidesOfUser(userName: string): Promise<IGuide[]>;
    getGuidesWithTags(tags: ITag['name'][]): Promise<IGuide[]>; // ITag['name'][] wird zu dem Typ string[] zur compilezeit
    getGuidesPaged(index: number, size: number): Promise<IGuide[]>;
    getTopGuides(limit: number): Promise<IGuide[]>;
    getGuidesByLocation(latitude: number, longitude: number, radius: number): Promise<GuideLocationDto[]>;
    update(guide: IGuide): Promise<void>;
}

export interface ITagRepository extends IGenericRepository<ITag, string> {
    getTagByName(name: string): Promise<ITag | null>;
    getTagsBeginningWith(letters: string): Promise<ITag[]>;
    getTopUsedTags(limit: number): Promise<ITag[]>;
    update(tag: ITag): Promise<void>;
}

export interface IUserRepository {
    getById(id: string): Promise<IUser | null>;
    getByAuthId(id: string): Promise<IUser | null>;
    getUserByName(name: string): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    add(item: IUser): Promise<string>;
    addRange(items: IUser[]): Promise<void>;
}

export interface ITrackRepository extends IGenericRepository<ITrack, string> {
    getByGuide(guideId: string): Promise<ITrack[]>;
}

export interface IUnitOfWork {
    readonly guides: IGuideRepository;
    readonly tags: ITagRepository;
    readonly users: IUserRepository;
    readonly ratings: IRatingRepository;
    readonly tracks: ITrackRepository;

    clearDatabase(): Promise<void>;
}

export interface IDataInitializer {
    initDataSync(): number;
    initData(): Promise<number>;

    getGuides(): IGuide[];
    getUsers(): IUser[];
    getTags(): ITag[];
    getRatings(): IRating[];
}
