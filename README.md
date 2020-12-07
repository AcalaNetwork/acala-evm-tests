# acala-evm-tests

Run Acala node:

- Clone Acala: https://github.com/AcalaNetwork/Acala
- Run with Ethereum compatible mode: `make run-eth`

Run tests:

- Install deps: `yarn`
- Run all tests: `yarn test`

---

## Run scanner 

### Start db

```bash
$ cd packages/indexer
$ docker-compose up
```

### Remove db

```bash
$ cd packages/indexer
$ docker-compose stop && docker-compose rm
```

### Start indexer

```bash
$ yarn workspace indexer run start
```


