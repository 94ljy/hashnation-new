import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'
import FileStore from 'session-file-store'
import * as passport from 'passport'

const f = FileStore(session)

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.setGlobalPrefix('/v1/api/')

    app.useGlobalPipes(
        new ValidationPipe({
            // disableErrorMessages:
            //     configService.get('NODE_ENV') === 'production',
            // whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    )

    app.use(
        session({
            secret: 'temp secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
            },
            // store: new RedisStore({ client: client }),
            store: new f({
                path: './tmp/sessions',
            }),
        }),
    )

    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(3000)
}
bootstrap()
