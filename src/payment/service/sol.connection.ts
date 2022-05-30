import { Injectable } from '@nestjs/common'
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js'

@Injectable()
export class SolanaConnection extends Connection {
    constructor() {
        // const url = clusterApiUrl(
        //     configService.get('SOLANA_CLUSTER') as Cluster,
        // )
        super(clusterApiUrl('devnet'))
    }
}
