import { IUserDto } from '../../core/data-transfer-objects';
import { $Log } from '../../utils/logger';
import { query, checkSchema } from 'express-validator';
import { Request, Response } from 'express';

import { Endpoint, Get, Validate, Post, Query, Params } from "../../nexos-express/decorators";
import { Ok, BadRequest, Created  } from "../../nexos-express/models";
import { IUnitOfWork } from '../../core/contracts';

@Endpoint('users')
export class UserEndpoint {
    constructor(private readonly unitOfWork: IUnitOfWork) {
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.users.getAll());
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Get('/byName')
    @Validate(query('username', 'we need a username').isString())
    async getByName(@Query('username') userName: any, req: Request, res: Response) {
        try {
            return Ok(await this.unitOfWork.users.getUserByName(name));
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Get('/:id')
    async getById(@Params('id') id: any, req: Request, res: Response) {
        // const id = req.params['id'];

        try {
            return Ok(await this.unitOfWork.users.getById(id));
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Post('/')
    @Validate(checkSchema({
        id: { isString: true },
        username: { isString: true },
        name: { isString: true, optional: true },
        email: { isString: true, optional: true },
        description: { isString: true, optional: true }
    }))
    async addUser(req: Request, res: Response) {
        try {
            const user: IUserDto = this.mapToUser(req.body);
            await this.unitOfWork.users.add(user)
            return Created("user inserted");
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToUser(obj: any): IUserDto {
        let { id, username, name, email, description } = obj;

        if(id === undefined) throw new Error("no id defined")
        if (username === undefined) throw new Error("no username defined");
        // if (name === undefined) name = '';
        // if (email === undefined) email = '';
        // if (description === undefined) description = '';
        
        return {id, username, name, email, description} as IUserDto; 
    }

}
