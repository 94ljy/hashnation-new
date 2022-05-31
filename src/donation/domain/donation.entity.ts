import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { User } from '../../user/domain/user.entity'

export enum DonationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity({ name: 'donation' })
export class Donation extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @Column({ name: 'status' })
    status: DonationStatus

    @Column({ name: 'message' })
    message: string

    @Column({ name: 'amount' })
    amount: number

    @Column({ name: 'to_user_id' })
    toUserId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'to_user_id' })
    toUser: User

    private constructor() {
        super()
    }

    public static byId(id: string): Donation {
        const donation = new Donation()
        donation.id = id

        return donation
    }

    public static createPendingDonation(
        message: string,
        amount: number,
        userId: string,
    ) {
        const donation = new Donation()
        donation.status = DonationStatus.PENDING
        donation.message = message
        donation.amount = amount
        donation.toUserId = userId

        return donation
    }

    isApproved(): boolean {
        return this.status === DonationStatus.APPROVED
    }

    isPending(): boolean {
        return this.status === DonationStatus.PENDING
    }

    approve(): void {
        this.status = DonationStatus.APPROVED
    }

    reject(): void {
        this.status = DonationStatus.REJECTED
    }
}
