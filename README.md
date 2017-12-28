# Crypto Price

> An app to inform us of price (USD & EUR) of the main crypto-coins, built with [Quasar Framework](http://quasar-framework.org/)

### How to start

```bash
$ npm i
```

If `quasar` is not installed globally:

```bash
$ npm i -g quasar
```

After:

```bash
$ quasar build
```

```bash
$ cd cordova
$ mklink www ..\dist\
```

`mklink` command exist in cmd shell.

If `cordova` is not installed globally:

```bash
$ npm i -g cordova
```

After:

```bash
$ cordova add platform android
$ cordova build
```

### For development

```bash
$ quasar dev
```

### For emulate

```bash
$ quasar build
$ cordova emulate android
```
