import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseTimeEntity {
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
    deleteAt?: Date
}
