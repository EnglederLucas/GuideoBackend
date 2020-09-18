import { UserController } from '../../logic/controllers';
import { UserDto } from '../../core/data-transfer-objects';
import $Log from '../../utils/logger';
import { query } from 'express-validator';
import { Request, Response } from 'express';

import { Endpoint, Get, Validate, Post } from "../../nexos-express/decorators";
import { Ok, BadRequest, Created  } from "../../nexos-express/models";

@Endpoint('users')
export class UserEndpoint {
    constructor(private userController: UserController) {
    }

    @Get('/')
    async getAll(req: Request, res: Response) {
        try {
            return Ok(await this.userController.getAll());
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Get('/byName')
    @Validate(query('username', 'we need a username').isString())
    async getByName(req: Request, res: Response) {
        const userName = req.query.username;

        try {
            return Ok(await this.userController.getUserByName(userName));
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Get('/:id')
    async getById(req: Request, res: Response) {
        const id = req.params['id'];

        try {
            return Ok(await this.userController.getById(id));
        }
        catch(ex) {
            return BadRequest(ex);
        }
    }

    @Post('/')
    async addUser(req: Request, res: Response) {
        try {
            const user: UserDto = this.mapToUser(req.body);
            await this.userController.add(user);
            return Created("user inserted");
        } catch (err) {
            return BadRequest(err.toString());
        }
    }

    private mapToUser(obj: any): UserDto {
        let { id, username, name, email, description } = obj;

        if(id === undefined) throw new Error("no id defined")
        if (username === undefined) throw new Error("no username defined");
        // if (name === undefined) name = '';
        // if (email === undefined) email = '';
        // if (description === undefined) description = '';
        
        return {id, username, name, email, description} as UserDto; 
    }

}
