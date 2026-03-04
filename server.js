const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// eBayから送られてくる検証チャレンジに応答する
app.get('/ebay/account-deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).json({ error: 'challenge_code is required' });
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpoint = process.env.EBAY_ENDPOINT_URL;

  // eBayが要求するハッシュを生成
  const hash = crypto.createHash('sha256');
  hash.update(challengeCode);
  hash.update(verificationToken);
  hash.update(endpoint);
  const challengeResponse = hash.digest('hex');

  console.log(`✅ Challenge received: ${challengeCode}`);
  console.log(`✅ Response sent: ${challengeResponse}`);

  return res.status(200).json({ challengeResponse });
});

// アカウント削除通知を受け取る（POSTリクエスト）
app.post('/ebay/account-deletion', (req, res) => {
  console.log('📩 Account deletion notification received:', JSON.stringify(req.body, null, 2));
  // 通知を受け取ったことをeBayに伝える
  return res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
