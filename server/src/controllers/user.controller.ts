import { Request, Response } from 'express'

export class UserController {
    static getUsers(req: Request, res: Response) {
        res.status(200).json({ users: 'user 1' })
    }
}
