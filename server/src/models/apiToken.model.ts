import prisma from '@/common/database';
import { ApiTokenPayload } from '@/validators/user.validator';

export class ApiTokenModel {
    static createApiToken(apiToken: ApiTokenPayload) {
        return prisma.apiToken.create({
            data: apiToken,
            select: { id: true, name: true, createdAt: true, updatedAt: true },
        });
    }

    static getApiTokensByUserId(userId: string) {
        return prisma.apiToken.findMany({
            where: { userId: userId, isArchived: false, isBlacklisted: false },
            select: { id: true, name: true, createdAt: true, updatedAt: true },
        });
    }
    static archiveApiToken(apiTokenId: string) {
        return prisma.apiToken.update({
            where: { id: apiTokenId, isArchived: false },
            data: { isArchived: true },
        });
    }

    static getApiTokenBySecretToken(secretToken: string) {
        return prisma.apiToken.findUnique({
            where: {
                secretToken: secretToken,
                isArchived: false,
                isBlacklisted: false,
            },
            include: { User: true },
        });
    }
}
