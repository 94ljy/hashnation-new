import { Body, Post } from '@nestjs/common'
import { BaseResponse } from '../../common/domain/response'
import { UserService } from '../service/user.service'
import { UserCreateDto, UserCreateResponseDto } from './dto/user.create.dto'

export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/join')
    async join(
        @Body() userCreateDto: UserCreateDto,
    ): Promise<BaseResponse<UserCreateResponseDto>> {
        const createdUser = await this.userService.create(
            await userCreateDto.toEntity(),
        )

        return BaseResponse.OK_WITH(UserCreateResponseDto.from(createdUser))
    }
}
