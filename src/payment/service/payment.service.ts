import { BadRequestException, Injectable } from '@nestjs/common'
import {
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { DonationQueryService } from '../../donation/service/donation.query.service'
import { Wallet } from '../../wallet/domain/wallet.entity'
import { WalletService } from '../../wallet/service/wallet.service'
import { Payment } from '../domain/payment.entity'
import { PaymentRepository } from '../repository/payment.repository'
import { SolanaConnection } from './sol.connection'
import { SolTransferTransaction } from './sol.transfer.transaction'

const SOL_PRICE = 100000

@Injectable()
export class PaymentService {
    constructor(
        private readonly solanaConnection: SolanaConnection,
        private readonly paymentRepository: PaymentRepository,
        private readonly donationQueryService: DonationQueryService,
        private readonly walletService: WalletService,
    ) {}

    // 임시 메서드
    private async amountToSol(amount: number): Promise<number> {
        return amount / SOL_PRICE
    }

    private async getUserWallet(userId: string): Promise<Wallet> {
        const uesrWallets = await this.walletService.getUserWallets(userId)
        const wallet = uesrWallets.getCurrencyWallet(CURRENCY_TYPE.SOL)
        if (!wallet) throw new BadRequestException('Wallet not found')

        return wallet
    }

    async getSolTransaction(
        donationId: string,
        fromAddress: string,
    ): Promise<string> {
        const donation = await this.donationQueryService.findById(donationId)

        if (!donation) throw new BadRequestException('Donation not found')

        const wallet = await this.getUserWallet(donation.toUserId)

        const fromPubkey = new PublicKey(fromAddress)
        const toPubkey = new PublicKey(wallet.address)
        const lamports = await this.amountToSol(donation.amount)
        const recentBlockhash = (
            await this.solanaConnection.getLatestBlockhash()
        ).blockhash

        const transaction = new Transaction()
        transaction.add(
            SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports,
            }),
        )
        transaction.recentBlockhash = recentBlockhash
        transaction.feePayer = fromPubkey

        return transaction
            .serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            })
            .toString('base64')
    }

    async payBySol(donationId: string, rawTransaction: string) {
        const donation = await this.donationQueryService.findById(donationId)

        if (!donation) {
            throw new BadRequestException('Donation not found')
        }

        if (await this.getPaymentByDonationId(donationId)) {
            throw new BadRequestException('Payment already exists')
        }

        const solTransfer =
            SolTransferTransaction.fromRawTransaction(rawTransaction)

        const payment = await this.paymentRepository.save(
            solTransfer.toPayment(donation),
        )

        const tx = await this.solanaConnection.sendRawTransaction(
            solTransfer.serialize(),
        )

        const res = await this.solanaConnection.confirmTransaction(tx)

        if (res.value.err !== null) {
            payment.reject()
        } else {
            payment.approve()
        }

        return await this.paymentRepository.save(payment)
    }

    async getPaymentByDonationId(
        donationId: string,
    ): Promise<Payment | undefined> {
        return await this.paymentRepository.findOne({
            where: {
                donationId,
            },
        })
    }
}
