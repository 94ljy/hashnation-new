import { User } from '../../domain/user.entity'

export class UserCreateDto {
    public readonly username: string
    public readonly password: string
    public readonly email: string

    async toEntity(): Promise<User> {
        return User.create(this.username, this.password, this.email)
    }
}

export class UserCreateResponseDto {
    public readonly id: string
    public readonly username: string
    public readonly email: string

    private constructor(user: User) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
    }

    public static from(user: User): UserCreateResponseDto {
        return new UserCreateResponseDto(user)
    }
}
