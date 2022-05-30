import { TypeOrmModule } from '@nestjs/typeorm'

export const testDatabaseModule = TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
})

export function createTestDatabaseModule(entities: any[]) {
    return TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: entities,
        synchronize: true,
    })
}
