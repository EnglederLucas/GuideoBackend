import { IGuide, IRating, ITag, IUser } from './models';

export interface IGenericRepository<TEntity, TId> {
    getAll(): Promise<TEntity[]>;
    add(item: TEntity): Promise<void>;
    addRange(items: TEntity[]): Promise<void>;
}

export interface IRatingRepository extends IGenericRepository<IRating, any> {
    getRatingsOfGuide(guideName: string) : Promise<IRating[]>;
    getAverageRatingOfGuide(guideName: string): Promise<number>;
    getRatingsOfUser(userName: string) : Promise<IRating[]>;
}

export interface IGuideRepository extends IGenericRepository<IGuide, string> {
    getGuideByName(name: string) : Promise<IGuide>;
    getGuidesOfUser(userName: string) : Promise<IGuide[]>;
    getGuidesWithTags(tags: ITag[]): Promise<IGuide[]>;
    getGuidesPaged(index: number, size: number): Promise<IGuide[]>;
}

export interface IUserRepository extends IGenericRepository<IUser, string> {
    getUserByName(name: string): Promise<IUser>;
}

export interface ITagRepository extends IGenericRepository<ITag, string> {
    getTagByName(name: string): Promise<ITag | undefined>;
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