import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { throwError } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
const argon = require('argon2')

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signIn(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) throw new ForbiddenException('Provided credentials are incorrect!')

        const comparePasswords = await argon.verify(user.password, dto.password)
        if (!comparePasswords) throw new ForbiddenException('Provided credentials are incorrect!')

        return user
    }

    async signUp(dto: AuthDto) {
        const hashedPassword = await argon.hash(dto.password)
        try {
            const { password, ...email } = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword
                }
            });
            return email
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('The credentials are already taken by other user!')
                }
            }
            throw error
        }
    }
}