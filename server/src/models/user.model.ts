import prisma from '@/common/database'
import { UserPayload } from '@/validators/user.validator'

export class UserModel {
    static async createUser(user: UserPayload) {
        return await prisma.user.create({
            data: { userId: user.userId },
            select: { userId: true },
        })
    }

    static async archiveUser(user: UserPayload) {
        return await prisma.user.update({
            where: { userId: user.userId },
            data: { isArchived: true },
            select: { userId: true, isArchived: true },
        })
    }
}
