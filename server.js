const express = require('express'); // v2
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/ebay/account-deletion', (req, res) => {
  console.log('GET /ebay/account-deletion called');
  const challengeCode = req.query.challenge_code;
  
  if (!challengeCode) {
    return res.status(200).json({ status: 'endpoint is active' });
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpoint = process.env.EBAY_ENDPOINT_URL;

  console.log('Token:', verificationToken);
  console.log('Endpoint:', endpoint);

  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(verificationToken);
  hash.update(endpoint);
  const challengeResponse = hash.digest('hex');

  return res.status(200).json({ challengeResponse });
});

app.post('/ebay/account-deletion', (req, res) => {
  return res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
