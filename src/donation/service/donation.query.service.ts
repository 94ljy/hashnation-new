import { Injectable } from '@nestjs/common'
import { Donation } from '../domain/donation.entity'
import { DonationRepository } from '../repository/donation.repository'

@Injectable()
export class DonationQueryService {
    constructor(private readonly donationRepository: DonationRepository) {}

    async findById(id: string): Promise<Donation | undefined> {
        return this.donationRepository.findOne(id)
    }
}
