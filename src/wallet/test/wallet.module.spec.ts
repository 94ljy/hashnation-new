import { Test, TestingModule } from '@nestjs/testing'
import { Keypair } from '@solana/web3.js'
import * as nacl from 'tweetnacl'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { testDatabaseModule } from '../../common/module/test.database'
import { CREATE_USER_WALLSET_MESSAGE, Wallet } from '../domain/wallet.entity'
import { WalletService } from '../service/wallet.service'
import { WalletModule } from '../wallet.module'

describe('WalletModule', () => {
    let module: TestingModule
    let walletService: WalletService
    const userId = 'user-id'
    const keypair = Keypair.generate()

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [WalletModule, testDatabaseModule],
        }).compile()

        walletService = module.get(WalletService)
    })

    afterEach(async () => {
        await module.close()
    })

    it('should be defined', () => {
        expect(walletService).toBeDefined()
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
})
