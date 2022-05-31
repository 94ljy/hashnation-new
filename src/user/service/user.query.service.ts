import { Injectable } from '@nestjs/common'
import { User } from '../domain/user.entity'
import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UserQueryService {
    constructor(private readonly userRepository: UserRepository) {}

    findById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } })
    }

    findByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } })
    }
}
