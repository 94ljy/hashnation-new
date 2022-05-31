import { PublicKey } from '@solana/web3.js'
import * as nacl from 'tweetnacl'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { User } from '../../user/domain/user.entity'

export const CREATE_USER_WALLSET_MESSAGE = new TextEncoder().encode(
    'Approve Add Wallet',
)

@Entity({ name: 'wallet' })
export class Wallet extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    public id: string

    @Column({ name: 'currency', nullable: false })
    public currency: CURRENCY_TYPE

    @Column({ nullable: false, name: 'address' })
    public address: string

    @Column({ nullable: false, name: 'description' })
    public description: string

    @Column({ nullable: false, name: 'user_id' })
    public userId: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    public user: User

    public static createWallet(
        currency: CURRENCY_TYPE,
        address: string,
        userId: string,
    ) {
        const wallet = new Wallet()
        wallet.currency = currency
        wallet.address = address
        wallet.description = ''
        wallet.userId = userId

        return wallet
    }

    validate(signature: string) {
        if (this.currency === CURRENCY_TYPE.SOL) {
            try {
                const pub = new PublicKey(this.address)

                const isValidSignature = nacl.sign.detached.verify(
                    CREATE_USER_WALLSET_MESSAGE,
                    Buffer.from(signature, 'base64'),
                    pub.toBuffer(),
                )
                if (!isValidSignature) throw new Error()
            } catch (e) {
                throw new Error('Invalid signature')
            }
        } else {
            throw new Error('Invalid currency')
        }
    }
}
