# acala-evm-tests

Run tests: `yarn workspace linkdrop run test "**/*.ts"`

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


