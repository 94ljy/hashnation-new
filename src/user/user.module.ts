import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './controller/user.controller'
import { UserRepository } from './repository/user.repository'
import { UserQueryService } from './service/user.query.service'
import { UserService } from './service/user.service'

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UserService, UserQueryService],
})
export class UserModule {}
