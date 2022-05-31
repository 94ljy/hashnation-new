import { Test, TestingModule } from '@nestjs/testing'
import { testDatabaseModule } from '../../common/module/test.database'
import { User } from '../domain/user.entity'
import { UserRepository } from '../repository/user.repository'
import { UserService } from '../service/user.service'
import { UserModule } from '../user.module'

describe('UserModule', () => {
    let module: TestingModule
    let userService: UserService
    let userRepository: UserRepository

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [testDatabaseModule, UserModule],
        }).compile()

        userService = module.get<UserService>(UserService)
        userRepository = module.get<UserRepository>(UserRepository)
    })

    afterEach(async () => {
        await module.close()
    })

    it('create user', async () => {
        const username = 'username'
        const password = 'password'
        const email = ''

        const user = await User.create(username, password, email)
        await userService.create(user)

        const findedUser = await userRepository.findOne({ username })

        expect(findedUser).toBeDefined()
        expect(findedUser?.username).toBe(username)
        expect(findedUser?.email).toBe(email)
        await expect(findedUser?.comparePassword(password)).resolves.toBe(true)
    })

    it('create user fail with same username', async () => {
        const username = 'username'
        const password = 'password'
        const email = ''

        const user = await User.create(username, password, email)
        await userService.create(user)

        const findedUser = await userRepository.findOne({ username })

        expect(findedUser).toBeDefined()
        expect(findedUser?.username).toBe(username)
        expect(findedUser?.email).toBe(email)
        await expect(findedUser?.comparePassword(password)).resolves.toBe(true)

        const sameUser = await User.create(username, password, email)
        await expect(userService.create(sameUser)).rejects.toThrowError(
            'username is already exists',
        )
    })
})
