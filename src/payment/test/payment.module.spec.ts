import { Test, TestingModule } from '@nestjs/testing'
import { Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import {
    createTestDatabaseModule,
    testDatabaseModule,
} from '../../common/module/test.database'
import { Donation } from '../../donation/domain/donation.entity'
import { DonationQueryService } from '../../donation/service/donation.query.service'
import { DonationService } from '../../donation/service/donation.service'
import { Payment } from '../domain/payment.entity'
import { PaymentModule } from '../payment.module'
import { PaymentService } from '../service/payment.service'
import { SolanaConnection } from '../service/sol.connection'

describe('PaymentModule', () => {
    let module: TestingModule
    let paymentService: PaymentService
    let donationService: DonationService
    let solanaConnection: SolanaConnection
    const userId = 'test-user-id'
    const keyPair = Keypair.generate()
    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [testDatabaseModule, PaymentModule],
        }).compile()

        paymentService = module.get(PaymentService)
        donationService = module.get(DonationService)
        solanaConnection = module.get(SolanaConnection)
    })

    afterEach(async () => {
        await module.close()
    })

    it('get sol transaction fail by invalid donation id', async () => {
        await expect(
            paymentService.getSolTransaction(
                'invalid',
                keyPair.publicKey.toString(),
            ),
        ).rejects.toThrow()
    })

    it('get sol trasaction success', async () => {
        const donation = await donationService.createPendingDonation(
            'test',
            1000,
            userId,
        )

        await expect(
            paymentService.getSolTransaction(
                donation.id,
                keyPair.publicKey.toString(),
            ),
        ).resolves.not.toThrow()
    })

    it('pay success', async () => {
        const tt = await solanaConnection.requestAirdrop(
            keyPair.publicKey,
            LAMPORTS_PER_SOL,
        )

        await solanaConnection.confirmTransaction(tt)

        const donation = await donationService.createPendingDonation(
            'test',
            1000,
            userId,
        )

        const txRaw = await paymentService.getSolTransaction(
            donation.id,
            keyPair.publicKey.toString(),
        )

        const tx = Transaction.from(Buffer.from(txRaw, 'base64'))

        tx.sign(keyPair)

        const payment = await paymentService.payBySol(
            donation.id,
            tx.serialize().toString('base64'),
        )

        expect(payment.isApproved()).toBe(true)
    }, 60000)
})
