import { IUser, IGuide } from "../core/models";

export class DataInitializer {
    static getUsers(): IUser[] {
        return [
            { name: 'Max', password: 'Hellome' },
            { name: 'Mux', password: 'Helloma' },
            { name: 'Err', password: '123' },
            { name: 'Mugiwara', password: 'rotata' }
        ];
    }

    static getGuides(): IGuide[] {
        return [];
    }
}