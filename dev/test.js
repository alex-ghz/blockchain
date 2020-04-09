const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1586418057705,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1586418079510,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1586418139923,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "7373dd907a3511eaaff19106dbbcda10",
                    "transactionId": "807666c07a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 10,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "9b46df707a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 50,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "9ebd68907a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 100,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "a1d46c907a3511eaaff19106dbbcda10"
                }
            ],
            "nonce": 13059,
            "hash": "0000fdd241113c7532c3891d2d9cab4743a7bb7e70b483e41f86a6d221f9b29f",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1586418172465,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "7373dd907a3511eaaff19106dbbcda10",
                    "transactionId": "a475a4507a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 40,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "b119e0e07a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 70,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "b322d0407a3511eaaff19106dbbcda10"
                },
                {
                    "amount": 55,
                    "sender": "ASSADA25FA76D78A6D",
                    "recipient": "JKNAASDASDA431213",
                    "transactionId": "b56853707a3511eaaff19106dbbcda10"
                }
            ],
            "nonce": 40053,
            "hash": "0000c098e77a5a1e8e9a6695b1229df558d836efe2298528d39fae35920d6099",
            "previousBlockHash": "0000fdd241113c7532c3891d2d9cab4743a7bb7e70b483e41f86a6d221f9b29f"
        },
        {
            "index": 5,
            "timestamp": 1586418183501,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "7373dd907a3511eaaff19106dbbcda10",
                    "transactionId": "b7db01207a3511eaaff19106dbbcda10"
                }
            ],
            "nonce": 103989,
            "hash": "0000171626d1efcb48b605615a4da639aeceeeb4f181ddcfffd2b19223a9fe01",
            "previousBlockHash": "0000c098e77a5a1e8e9a6695b1229df558d836efe2298528d39fae35920d6099"
        },
        {
            "index": 6,
            "timestamp": 1586418185351,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "7373dd907a3511eaaff19106dbbcda10",
                    "transactionId": "be6ef6e07a3511eaaff19106dbbcda10"
                }
            ],
            "nonce": 214075,
            "hash": "00002876c3cc23ffa7a45e8d56f877fb59a4d222825d7ccd3cb540c73f05d338",
            "previousBlockHash": "0000171626d1efcb48b605615a4da639aeceeeb4f181ddcfffd2b19223a9fe01"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "7373dd907a3511eaaff19106dbbcda10",
            "transactionId": "bf8967907a3511eaaff19106dbbcda10"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
};

console.log('valid: ', bitcoin.chainIsValid(bc1.chain));