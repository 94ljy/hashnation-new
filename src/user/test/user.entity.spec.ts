import { User } from '../domain/user.entity'

describe('userEntity', () => {
    const username = 'username'
    const password = 'password'
    const email = ''
    let user: User

    beforeEach(async () => {
        user = await User.create(username, password, email)
    })

    it('create', async () => {
        expect(user).toBeDefined()
        expect(user.username).toBe(username)
        expect(user.email).toBe(email)
        await expect(user.comparePassword(password)).resolves.toBe(true)
    })

    it('setPassword', async () => {
        const newPassword = 'newPassword'

        await user.setPassword(newPassword)

        await expect(user.comparePassword(newPassword)).resolves.toBe(true)
    })

    it('invalide password', async () => {
        const invalidePassword = 'invalidPassword'

        await expect(user.comparePassword(invalidePassword)).resolves.toBe(
            false,
        )
    })

    it('updateLastLoginAt', () => {
        expect(user.lastLoginAt).toBeUndefined()

        user.updateLastLoginAt()

        expect(user.lastLoginAt).toBeDefined()
    })

    it('isEmailVerified', () => {
        expect(user.isEmailVerified).toBe(false)

        user.verfiyEmail()

        expect(user.isEmailVerified).toBe(true)
    })
})
