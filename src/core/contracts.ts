import { IGuide, IRating, ITag, IUser, ITrack } from './models';
import { IUserDto } from './data-transfer-objects';

export interface IGenericRepository<TEntity, TId> {
    getAll(): Promise<TEntity[]>;
    add(item: TEntity): Promise<void>;
    addRange(items: TEntity[]): Promise<void>;
    getById(id: TId): Promise<TEntity | null>;
}

export interface IRatingRepository extends IGenericRepository<IRating, any> {
    getRatingsOfGuide(guideId: string) : Promise<IRating[]>;
    getAverageRatingOfGuide(guideId: string): Promise<number>;
    getRatingsOfUser(userId: string) : Promise<IRating[]>;
    getSpecificOf(guideId: string, userId: string): Promise<IRating | undefined>;
}

export interface IGuideRepository extends IGenericRepository<IGuide, string> {
    getGuidesByName(name: string) : Promise<IGuide[]>;
    getGuidesOfUser(userName: string) : Promise<IGuide[]>;
    getGuidesWithTags(tags: ITag['name'][]): Promise<IGuide[]>;     // ITag['name'][] wird zu dem Typ string[] zur compilezeit
    getGuidesPaged(index: number, size: number): Promise<IGuide[]>;
    getTopGuides(limit: number): Promise<IGuide[]>
    update(guide: IGuide): Promise<void>;
}

export interface ITagRepository extends IGenericRepository<ITag, string> {
    getTagByName(name: string): Promise<ITag | null>;
    getTagsBeginningWith(letters: string): Promise<ITag[]>;
    getTopUsedTags(limit: number): Promise<ITag[]>;
    update(tag: ITag): Promise<void>;
}

export interface IUserRepository {
    getById(id: string): Promise<IUserDto | null>;
    getUserByName(name: string): Promise<IUserDto>;
    getAll(): Promise<IUserDto[]>;
    add(item: IUserDto): Promise<void>;
    addRange(items: IUserDto[]): Promise<void>;
}

export interface ITrackRepository {
    add(guideId: string, item: ITrack): Promise<void>;
    addRange(guideId: string, items: ITrack[]): Promise<void>;
    getByGuide(guideId: string): Promise<ITrack[]>;
    getById(guideId: string, trackId: string): Promise<ITrack>;
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