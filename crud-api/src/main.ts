import 'dotenv/config';
import http from 'node:http';

import { logger } from './common/logger';
import { userRouter } from './routes/user.router';

const start = () => {
    const PORT = process.env.PORT || '3000';

    http.createServer(userRouter).listen(PORT, () =>
        logger.info(`Server is running on http://localhost:${PORT}`)
    );
};

start();
