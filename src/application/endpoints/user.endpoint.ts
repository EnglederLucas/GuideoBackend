import { $Log } from '../../utils/logger';
import { query, checkSchema } from 'express-validator';
import { Request, Response } from 'express';

import { Endpoint, Get, Validate, Post, Query, Params, Body, Put } from '../../nexos-express/decorators';
import { Ok, BadRequest, Created, JsonResponse, NoContent } from '../../nexos-express/models';
import { IUnitOfWork } from '../../core/contracts';
import { IUser } from '../../core/models';

@Endpoint('users')
export class UserEndpoint {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    @Get('/')
    async getAll(req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.users.getAll());
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/byName')
    @Validate(query('username', 'we need a username').isString())
    async getByName(@Query('username') userName: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.users.getUserByName(userName));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/:id')
    async getById(@Params('id') id: any, req: Request, res: Response) {
        // const id = req.params['id'];

        try {
            return Ok(await this.unitOfWork.users.getById(id));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Get('/byauthid/:authid')
    async getByAuthId(@Params('authid') authid: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.users.getByAuthId(authid));
        } catch (ex) {
            return BadRequest(ex);
        }
    }

    @Post('/')
    @Validate(
        checkSchema({
            username: { isString: true },
            authid: { isString: true },
            name: { isString: true, optional: true },
            email: { isString: true, optional: true },
            description: { isString: true, optional: true },
            imageLink: { isString: true, optional: true },
        }),
    )
    async addUser(req: Request, res: Response) {
        try {
            const user: IUser = this.mapToUser(req.body);
            const id = await this.unitOfWork.users.add(user);
            return Created({ id: id });
        } catch (err) {
            return BadRequest({ msg: err.toString() });
        }
    }

    @Put('/')
    @Validate(
        checkSchema({
            username: { isString: true },
            authid: { isString: true },
            name: { isString: true, optional: true },
            email: { isString: true, optional: true },
            description: { isString: true, optional: true },
            imageLink: { isString: true, optional: true },
        }),
    )
    async updateUser(@Body() userData: any, req: Request, res: Response) {
        try {
            const user: IUser = this.mapToUser(userData);
            this.unitOfWork.users.update(user);
            return Ok(`Updated user ${user.username}`);
        } catch (err) {
            return BadRequest({ msg: err.toString() });
        }
    }

    private mapToUser(obj: any): IUser {
        let { username, authid, name, email, description, imageLink } = obj;

        // if (id === undefined) throw new Error('no id defined');
        if (username === undefined) throw new Error('no username defined');
        if (authid === undefined) throw new Error('no username defined');
        // if (name === undefined) name = '';
        // if (email === undefined) email = '';
        // if (description === undefined) description = '';

        return { username, authid, name, email, description, imageLink } as IUser;
    }
}
