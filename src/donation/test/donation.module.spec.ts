import { Test, TestingModule } from '@nestjs/testing'
import { createTestDatabaseModule } from '../../common/module/test.database'
import { Donation } from '../domain/donation.entity'
import { DonationModule } from '../donation.module'
import { DonationService } from '../service/donation.service'

describe('DonationModule', () => {
    let donationService: DonationService
    let module: TestingModule
    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [createTestDatabaseModule([Donation]), DonationModule],
        }).compile()

        donationService = module.get(DonationService)
    })

    afterEach(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(donationService).toBeDefined()
    })

    it('create pending donation', async () => {
        const donation = await donationService.createPendingDonation(
            'test donation',
            1000,
            'test user id',
        )

        expect(donation.isPending()).toBe(true)
    })
})
