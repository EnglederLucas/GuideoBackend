import { IGuide, IRating, ITag, IUser } from './models';
import { UserDto } from './data-transfer-objects';

export interface IGenericRepository<TEntity, TId> {
    getAll(): Promise<TEntity[]>;
    add(item: TEntity): Promise<void>;
    addRange(items: TEntity[]): Promise<void>;
    // getById(id: TId): Promise<TEntity>;
}

export interface IRatingRepository extends IGenericRepository<IRating, any> {
    getRatingsOfGuide(guideName: string) : Promise<IRating[]>;
    getAverageRatingOfGuide(guideName: string): Promise<string>;
    getRatingsOfUser(userName: string) : Promise<IRating[]>;
}

export interface IGuideRepository extends IGenericRepository<IGuide, string> {
    getGuidesByName(name: string) : Promise<IGuide[]>;
    getGuidesOfUser(userName: string) : Promise<IGuide[]>;
    getGuidesWithTags(tags: ITag['name'][]): Promise<IGuide[]>;     // ITag['name'][] wird zu dem Typ string[] zur compilezeit
    getGuidesPaged(index: number, size: number): Promise<IGuide[]>;
}

export interface ITagRepository extends IGenericRepository<ITag, string> {
    getTagByName(name: string): Promise<ITag>;
}

export interface IUserRepository {
    getUserByName(name: string): Promise<UserDto>;
    getAll(): Promise<UserDto[]>;
    add(item: IUser): Promise<void>;
    addRange(items: IUser[]): Promise<void>;
}

export interface IUnitOfWork {
    readonly guides: IGuideRepository;
    readonly tags: ITagRepository;
    readonly users: IUserRepository;
    readonly ratings: IRatingRepository;
}

export interface IDataInitializer {
    initDataSync(): number;
    initData(): Promise<number>;

    getGuides(): IGuide[];
    getUsers(): IUser[];
    getTags(): ITag[];
    getRatings(): IRating[];
}
