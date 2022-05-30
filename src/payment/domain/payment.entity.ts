import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { Donation } from '../../donation/domain/donation.entity'

enum PAYMENT_STATUS {
    PENDING = 'PENDING',
    APPORVED = 'APPORVED',
    REJECTED = 'REJECTED',
}

@Entity({ name: 'payment' })
export class Payment extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'status' })
    status: PAYMENT_STATUS

    @Column({ name: 'currency' })
    currecy: CURRENCY_TYPE

    @Column({ name: 'tx_hash' })
    txHash: string

    @Column({ name: 'amount' })
    amount: string

    @Column({ name: 'from_address' })
    fromAddress: string

    @Column({ name: 'to_address' })
    toAddress: string

    @OneToOne(() => Donation, { cascade: true })
    @JoinColumn({ name: 'donation_id' })
    donation: Donation

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'user_id' })
    // user: User

    private constructor() {
        super()
    }

    public static createPenndingPayment(
        currecy: CURRENCY_TYPE,
        txHash: string,
        amount: string,
        fromAddress: string,
        toAddress: string,
        donation: Donation,
    ): Payment {
        const payment = new Payment()
        payment.currecy = currecy
        payment.txHash = txHash
        payment.amount = amount
        payment.fromAddress = fromAddress
        payment.toAddress = toAddress
        payment.donation = donation
        payment.status = PAYMENT_STATUS.PENDING
        return payment
    }

    approve() {
        this.donation.approve()
        this.status = PAYMENT_STATUS.APPORVED
    }

    reject() {
        this.donation.reject()
        this.status = PAYMENT_STATUS.REJECTED
    }

    isApproved(): boolean {
        return this.status === PAYMENT_STATUS.APPORVED
    }

    isRejected(): boolean {
        return this.status === PAYMENT_STATUS.REJECTED
    }

    isPending(): boolean {
        return this.status === PAYMENT_STATUS.PENDING
    }
}
