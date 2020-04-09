const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid').v1;
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function(req, res) {
    const newTransaction = req.body,
        blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);

    res.send({note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient),
        requestPromises = [];

    bitcoin.addTransactionToPendingTransaction(newTransaction);
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
           .then(data => {
               res.json({note: 'Transaction created and broadcast successfully.'});
           });
});

app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock(),
        previousBlockHash = lastBlock['hash'],
        currentBlockData = {
            transactions: bitcoin.pendingTransactions,
            index: lastBlock['index'] + 1
        },
        nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData),
        blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce),
        newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
           .then(data => {
               const requestOptions = {
                   uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
                   method: 'POST',
                   body: {
                       amount: 12.5,
                       sender: "00",
                       recipient: nodeAddress
                   },
                   json: true
               };

               return rp(requestOptions);
           })
           .then(data => {
               res.json({
                   note: "New block mined & broadcast successfully",
                   block: newBlock
               });
           });
});

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock,
        lastBlock = bitcoin.getLastBlock(),
        correctHash = lastBlock.hash === newBlock.previousBlockHash,
        correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];

        res.json({
            note: 'New block received and accepted',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        });
    }
});

app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    const regNodesPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
           .then(data => {
               const bulkRegisterOptions = {
                   uri: newNodeUrl + '/register-nodes-bulk',
                   method: 'POST',
                   body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
                   json: true
               };

               return rp(bulkRegisterOptions);
           })
           .then(data => {
               res.json({note: "New node registered with network successfully!"});
           });
});

app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl,
        nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1,
        notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    res.json({note: "New node registered successfully with node."});
});

app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) === -1,
            notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;

        if (nodeNotAlreadyPresent && notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });

    res.json({note: "Bulked registration successful."});
});

app.get('/consensus', function(req, res) {
    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
           .then(blockchains => {
               const currentChainLength = bitcoin.chain.length;
               let maxChainLength = currentChainLength,
                   newLongestChain = null,
                   newPendingTransactions = null;

               blockchains.forEach(blockchain => {
                   if (blockchain.chain.length > maxChainLength) {
                       console.log('here');
                       maxChainLength = blockchain.chain.length;
                       newLongestChain = blockchain.chain;
                       newPendingTransactions = blockchain.pendingTransactions;
                   }
               });

               if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                   res.json({
                       note: 'Current chain has not been replaced',
                       chain: bitcoin.chain
                   });
               } else {
                   bitcoin.chain = newLongestChain;
                   bitcoin.pendingTransactions = newPendingTransactions;

                   res.json({
                       note: 'This chain has been replaced',
                       chain: bitcoin.chain
                   });
               }
           });
});

app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);

    res.json({
        block: correctBlock
    });
});

app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);

    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('/address/:address', function(req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);

    res.json({
        addressData: addressData
    });
});

app.get('/block-explorer', function(req, res) {
    res.sendFile('./block-explorer/index.html', {root: __dirname});
});

app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});