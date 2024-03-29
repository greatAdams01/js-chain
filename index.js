const express = require('express')
const { redirect } = require('express/lib/response')
const Blockchain = require('./blockchain')
const P2pServer = require('./p2p-server')
const Wallet = require('./wallet')
const TransactionPool = require('./wallet/transaction-pool')
const Miner = require('./miner')

// Steller

const StellerService = require('./steller')

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
const bc = new Blockchain()
const wallet = new Wallet()
const tp = new TransactionPool()
const p2pServer = new P2pServer(bc, tp)
const miner = new Miner(bc, tp, wallet, p2pServer)
// Steller
const stellar = new StellerService()

stellar.createAssest().then(console.log)
.catch(function (error) {
  console.error("Error!", error);
});

app.get('/blocks', (req, res) => {
  res.json(bc.chain)
})

app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data)
  p2pServer.syncChains()
  res.redirect('/blocks')
})

app.get('/transactions', (req, res) => {
  res.json(tp.transactions)
})

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body
  const transaction = wallet.createTransaction(recipient, amount, bc, tp)
  p2pServer.brodcastTransaction(transaction)
  res.redirect('/transactions')
})

app.get('/mine-transaction', (req, res) => {
  const block = miner.mine()
  console.log(`New block added: ${block.toString()}`)
  res.redirect('/blocks')
})

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey })
})

// Steller 

app.get('/steller-accounts', (req, res) => {
  res.json({ accounts: stellar.getAccounts() })
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
p2pServer.listen()