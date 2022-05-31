import { HttpStatus } from '@nestjs/common'

export class BaseResponse<T> {
    public readonly status: HttpStatus
    public readonly message: string
    public readonly data: T

    constructor(status: HttpStatus, message: string, data: T) {
        this.status = status
        this.message = message
        this.data = data
    }

    public static OK() {
        return new BaseResponse(HttpStatus.OK, 'OK', null)
    }

    public static OK_WITH<T>(data: T) {
        return new BaseResponse(200, 'OK', data)
    }

    public static ERROR() {
        return new BaseResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'ERROR', null)
    }
}
