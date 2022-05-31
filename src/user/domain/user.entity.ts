import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import * as bcrypt from 'bcrypt'

@Entity({ name: 'user' })
export class User extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    @Column({ nullable: true, name: 'last_login_at' })
    public lastLoginAt?: Date

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        name: 'username',
    })
    public username: string

    @Column({
        type: 'varchar',
        length: 255,
        name: 'password',
    })
    private password: string

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        name: 'email',
    })
    public email: string

    @Column({ nullable: false, name: 'is_email_verified' })
    public isEmailVerified: boolean

    @Column({ nullable: false, name: 'is_active' })
    public isActive: boolean

    public static async create(
        username: string,
        password: string,
        email: string,
    ): Promise<User> {
        const user = new User()
        user.username = username
        user.email = email
        user.isEmailVerified = false
        user.isActive = true
        await user.setPassword(password)

        return user
    }

    public async setPassword(password: string) {
        this.password = await bcrypt.hash(password, 10)
    }

    public async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password)
    }

    public updateLastLoginAt() {
        this.lastLoginAt = new Date()
    }

    public verfiyEmail() {
        this.isEmailVerified = true
    }
}
