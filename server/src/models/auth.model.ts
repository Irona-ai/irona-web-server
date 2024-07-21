import prisma from '@/common/database'
import { RegisterPayload } from '@/validators/auth.validator'

export class AuthModel {
    static findUserByEmail(email: string) {
        return prisma.auth.findFirst({
            where: {
                email: email,
            },
            select: {
                email: true,
                password: true,
                User: true,
            },
        })
    }

    static async createUser(user: RegisterPayload) {
        return await prisma.user.create({
            data: {
                firstname: user.firstname,
                lastname: user.lastname,
                Auth: {
                    create: {
                        email: user.email,
                        password: user.password,
                    },
                },
            },
        })
    }

    static async createSession(userId: number, refreshToken: string) {
        return await prisma.session.create({
            data: {
                userid: userId,
                refreshToken: refreshToken,
            },
        })
    }
}
