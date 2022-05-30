import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WalletRepository } from './repository/wallet.repository'
import { WalletService } from './service/wallet.service'

@Module({
    imports: [TypeOrmModule.forFeature([WalletRepository])],
    controllers: [],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
