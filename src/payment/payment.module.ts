import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationModule } from '../donation/donation.module'
import { WalletModule } from '../wallet/wallet.module'
import { PaymentRepository } from './repository/payment.repository'
import { PaymentService } from './service/payment.service'
import { SolanaConnection } from './service/sol.connection'

@Module({
    imports: [
        DonationModule,
        WalletModule,
        TypeOrmModule.forFeature([PaymentRepository]),
    ],
    providers: [PaymentService, SolanaConnection],
})
export class PaymentModule {}
