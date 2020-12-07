# acala-evm-tests

Run tests: `yarn test`

## run scanner 

### start db

```bash
$ cd packages/indexer
$ docker-compose up
```

### remove db

```bash
$ cd packages/indexer
$ docker-compose stop && docker-compose rm
```

### start indexer

```bash
$ yarn workspace indexer run start
```


