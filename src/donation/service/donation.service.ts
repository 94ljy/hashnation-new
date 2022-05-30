import { Injectable } from '@nestjs/common'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { Donation } from '../domain/donation.entity'
import { DonationRepository } from '../repository/donation.repository'

@Injectable()
export class DonationService {
    constructor(private readonly donationRepository: DonationRepository) {}

    async createPendingDonation(
        message: string,
        amount: number,
        userId: string,
    ): Promise<Donation> {
        const donation = Donation.createPendingDonation(message, amount, userId)

        await this.donationRepository.save(donation)

        // TODO 도네이션 created event 추가

        return donation
    }
}
