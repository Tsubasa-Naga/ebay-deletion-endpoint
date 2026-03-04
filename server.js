const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.get('/ebay/account-deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;
  if (!challengeCode) {
    return res.status(200).send('Endpoint is running!');
  }
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN || 'ebayVerifyToken20240305AbCdEfGhIjKlMnOpQrSt';
  const endpoint = process.env.EBAY_ENDPOINT_URL || 'https://ebay-deletion-endpoint-9x2.onrender.com/ebay/account-deletion';
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
