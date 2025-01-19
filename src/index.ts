
import * as mongoose from 'mongoose';
import { env } from "bun";
import { server } from './server';
import Logger from './helpers/logger';
import cron from 'node-cron';
import { processUserMappings } from './models/sender';
import { User } from './models/user';
import { initializeConfiguration } from './helpers/config';

cron.schedule('0 0 * * * *', async () => {
    const all = await User.find({subscription:{level: "free"}}).exec()
    await Promise.all(all.map(processUserMappings))
})

cron.schedule('0 */30 * * * *',async () => {
  const all = await User.find({subscription:{level: "paid"}}).exec()
  await Promise.all(all.map(processUserMappings))
})

cron.schedule('0 */5 * * * *',async () => {
  const all = await User.find({subscription:{level: "premium"}}).exec()
  await Promise.all(all.map(processUserMappings))
})

const port = 3000;

const srv = server().listen(port, async () => {
  await initializeConfiguration();
  await mongoose.connect(env.MONGODB_URL!);
});

const handleShutdown = () => {
  srv.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
process.on("SIGHUP", handleShutdown);
