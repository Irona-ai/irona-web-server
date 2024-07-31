import prisma from '@/common/database';
import { UserPayload } from '@/validators/user.validator';

export class UserModel {
    static createUser(user: UserPayload) {
        return prisma.user.upsert({
            update: {},
            where: { userId: user.userId },
            create: { userId: user.userId },
            select: { userId: true },
        });
    }

    static async archiveUser(user: UserPayload) {
        return await prisma.user.update({
            where: { userId: user.userId },
            data: { isArchived: true },
            select: { userId: true, isArchived: true },
        });
    }
}
