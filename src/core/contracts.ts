import { IGuide, IRating, ITag, IUser, ITrack } from './models';
import { UserDto } from './data-transfer-objects';

export interface IGenericRepository<TEntity, TId> {
    getAll(): Promise<TEntity[]>;
    add(item: TEntity): Promise<string>;
    addRange(items: TEntity[]): Promise<void>;
    getById(id: TId): Promise<TEntity>;
}

export interface IRatingRepository extends IGenericRepository<IRating, any> {
    getRatingsOfGuide(guideName: string) : Promise<IRating[]>;
    getAverageRatingOfGuide(guideName: string): Promise<number>;
    getRatingsOfUser(userName: string) : Promise<IRating[]>;
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
    getTagByName(name: string): Promise<ITag>;
    getTagsBeginningWith(letters: string): Promise<ITag[]>;
    getTopUsedTags(limit: number): Promise<ITag[]>;
    update(tag: ITag): Promise<void>;
}

export interface IUserRepository {
    getById(id: string): Promise<UserDto>;
    getUserByName(name: string): Promise<UserDto>;
    getAll(): Promise<UserDto[]>;
    add(item: UserDto): Promise<void>;
    addRange(items: UserDto[]): Promise<void>;
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
}

export interface IDataInitializer {
    initDataSync(): number;
    initData(): Promise<number>;

    getGuides(): IGuide[];
    getUsers(): IUser[];
    getTags(): ITag[];
    getRatings(): IRating[];
}