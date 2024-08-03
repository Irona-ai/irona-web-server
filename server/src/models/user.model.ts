import prisma from '@/common/database';
import { UserPayload } from '@/validators/user.validator';

export class UserModel {
    static createUser(user: UserPayload) {
        return prisma.user.upsert({
            update: {},
            where: { userId: user.userId },
            create: {
                userId: user.userId,
                primaryEmailAddress: user.primaryEmailAddress,
            },
            select: { userId: true },
        });
    }

    static async archiveUser(userId: UserPayload['userId']) {
        return await prisma.user.update({
            where: { userId: userId },
            data: { isArchived: true },
            select: { userId: true, isArchived: true },
        });
    }

    static async updateUser(
        userId: UserPayload['userId'],
        user: Partial<UserPayload>
    ) {
        return await prisma.user.update({
            where: { userId: userId },
            data: user,
            select: { userId: true, isArchived: true },
        });
    }

    static async getUser(userId: UserPayload['userId']) {
        return await prisma.user.findUnique({
            where: { userId: userId },
        });
    }
}
