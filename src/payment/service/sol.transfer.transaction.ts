import { Transaction, SystemInstruction } from '@solana/web3.js'
import * as base58 from 'bs58'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { Donation } from '../../donation/domain/donation.entity'
import { Payment } from '../domain/payment.entity'

export class SolTransferTransaction {
    private constructor(
        public readonly signature: string,
        public readonly from: string,
        public readonly to: string,
        public readonly lamports: bigint,
        public readonly transaction: Transaction,
    ) {}

    public static fromRawTransaction(rawTransaction: string) {
        const transaction = Transaction.from(
            Buffer.from(rawTransaction, 'base64'),
        )

        if (transaction.signature === null || !transaction.verifySignatures()) {
            throw new Error('Transaction signature verification failed')
        }

        // tx validations
        if (transaction.instructions.length !== 1) {
            throw new Error('Invalid number of instructions')
        }

        const instruction = transaction.instructions[0]

        const result = SystemInstruction.decodeTransfer(instruction)

        transaction.signature

        const signature = base58.encode(transaction.signature)
        const from = result.fromPubkey.toString()
        const to = result.toPubkey.toString()
        const lamports = result.lamports // TODO: check if this is correct

        return new SolTransferTransaction(
            signature,
            from,
            to,
            lamports,
            transaction,
        )
    }

    serialize(): Buffer {
        return this.transaction.serialize()
    }

    toPayment(donation: Donation): Payment {
        return Payment.createPenndingPayment(
            CURRENCY_TYPE.SOL,
            this.signature,
            this.lamports.toString(),
            this.from,
            this.to,
            donation,
        )
    }
}
