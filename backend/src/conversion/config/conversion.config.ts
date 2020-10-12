import { registerAs } from '@nestjs/config';

export default registerAs('conversion',  () => ({
  appKey: process.env.EXCHANGE_APP_ID,
  endpoint: process.env.EXCHANGE_APP_CONVERT_ENDPOINT,
}));
