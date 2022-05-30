import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationController } from './donation.controller'
import { DonationRepository } from './repository/donation.repository'
import { DonationQueryService } from './service/donation.query.service'
import { DonationService } from './service/donation.service'

@Module({
    imports: [TypeOrmModule.forFeature([DonationRepository])],
    controllers: [DonationController],
    providers: [DonationService, DonationQueryService],
    exports: [DonationQueryService],
})
export class DonationModule {}
