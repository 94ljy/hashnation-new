import { BadRequestException, Injectable } from '@nestjs/common'
import { CURRENCY_TYPE } from '../../common/domain/currency'
import { UserWallets } from '../domain/user.wallets'
import { Wallet } from '../domain/wallet.entity'
import { WalletRepository } from '../repository/wallet.repository'

@Injectable()
export class WalletService {
    constructor(private readonly walletRepository: WalletRepository) {}

    async createWallet(
        userId: string,
        currency: CURRENCY_TYPE,
        walletAddress: string,
        signature: string,
    ) {
        const userWallets = await this.getUserWallets(userId)

        if (userWallets.hasCurrency(currency))
            throw new BadRequestException('Wallet already exists')

        const newWallet = Wallet.createWallet(currency, walletAddress, userId)

        newWallet.validate(signature)

        return await this.walletRepository.save(newWallet)
    }

    async getUserWallets(userId: string): Promise<UserWallets> {
        const wallets = await this.walletRepository.find({
            where: {
                userId,
            },
        })

        return new UserWallets(userId, wallets)
    }
}
