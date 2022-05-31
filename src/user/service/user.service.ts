import { Injectable } from '@nestjs/common'
import { User } from '../domain/user.entity'
import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(user: User): Promise<User> {
        const finded = await this.userRepository.find({
            username: user.username,
        })

        if (finded.length > 0) {
            throw new Error('username is already exists')
        }

        const createdUser = await this.userRepository.save(user)
        return createdUser
    }
}
