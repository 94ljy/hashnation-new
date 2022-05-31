import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseTimeEntity {
    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at' })
    deletedAt?: Date

    delete() {
        this.deletedAt = new Date()
    }
}
