import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationModule } from './donation/donation.module'
import { WalletModule } from './wallet/wallet.module'
import { PaymentModule } from './payment/payment.module'

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            synchronize: true,
            logging: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
        DonationModule,
        WalletModule,
        PaymentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
