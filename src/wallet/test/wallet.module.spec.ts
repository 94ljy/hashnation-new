import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { Keypair } from '@solana/web3.js'
import * as nacl from 'tweetnacl'
import { Repository } from 'typeorm'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { testDatabaseModule } from '../../common/module/test.database'
import { User } from '../../user/domain/user.entity'
import { CREATE_USER_WALLSET_MESSAGE, Wallet } from '../domain/wallet.entity'
import { WalletService } from '../service/wallet.service'
import { WalletModule } from '../wallet.module'

describe('WalletModule', () => {
    let module: TestingModule
    let walletService: WalletService
    const keypair = Keypair.generate()
    let userId: string

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                WalletModule,
                testDatabaseModule,
                TypeOrmModule.forFeature([User]),
            ],
        }).compile()
        walletService = module.get(WalletService)

        const userRepository = module.get<Repository<User>>(
            getRepositoryToken(User),
        )
        const user = (await userRepository.save({
            username: 'test',
            password: 'test',
            email: '',
            isEmailVerified: false,
            isActive: false,
        })) as any

        userId = user.id
    })

    afterEach(async () => {
        await module.close()
    })

    it('create wallet', async () => {
        const signature = nacl.sign.detached(
            CREATE_USER_WALLSET_MESSAGE,
            keypair.secretKey,
        )

        await walletService.createWallet(
            userId,
            CURRENCY_TYPE.SOL,
            keypair.publicKey.toString(),
            Buffer.from(signature).toString('base64'),
        )

        const userWallets = await walletService.getUserWallets(userId)

        expect(userWallets.getCurrencyWallet(CURRENCY_TYPE.SOL)?.address).toBe(
            keypair.publicKey.toString(),
        )
    })

    it('create wallet fail by duplicate curreny', async () => {
        const signature = nacl.sign.detached(
            CREATE_USER_WALLSET_MESSAGE,
            keypair.secretKey,
        )

        await walletService.createWallet(
            userId,
            CURRENCY_TYPE.SOL,
            keypair.publicKey.toString(),
            Buffer.from(signature).toString('base64'),
        )

        await expect(
            walletService.createWallet(
                userId,
                CURRENCY_TYPE.SOL,
                keypair.publicKey.toString(),
                Buffer.from(signature).toString('base64'),
            ),
        ).rejects.toThrow()

        const userWallets = await walletService.getUserWallets(userId)

        expect(userWallets.wallets.length).toBe(1)
    })

    it('create wallet fail by invalide signature', async () => {
        await expect(
            walletService.createWallet(
                userId,
                CURRENCY_TYPE.SOL,
                keypair.publicKey.toString(),
                Buffer.from('invalide signature').toString('base64'),
            ),
        ).rejects.toThrow()
    })

    it('create wallet fail by invalide address', async () => {
        await expect(
            walletService.createWallet(
                userId,
                CURRENCY_TYPE.SOL,
                'invalide address',
                Buffer.from('invalide signature').toString('base64'),
            ),
        ).rejects.toThrow()
    })
})
