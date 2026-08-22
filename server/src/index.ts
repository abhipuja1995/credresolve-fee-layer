import { createServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 CredResolve Fee Layer Server running at http://localhost:${PORT}`);
  console.log(`📡 Blackbaud SKY API Mode: ${process.env.BLACKBAUD_OAUTH_TOKEN ? 'LIVE' : 'HIGH-FIDELITY SANDBOX'}`);
});
