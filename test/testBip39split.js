'use strict';

describe('Test Bip39split class', function () {

    const MILLISECONDE = 1;
    const SECONDE = 1000 * MILLISECONDE;
    const MINUTE = 60 * SECONDE;

    const Bip39split = (typeof require !== "undefined") ? require('../src/js/bip39split') : window.Bip39split;
    const bip39 = (typeof require !== "undefined") ? require('bip39') : window.bip39;
    const CryptoJS = (typeof require !== "undefined") ? require('crypto-js') : window.CryptoJS;
    const secrets = (typeof require !== "undefined") ? require('secrets.js-grempe') : window.secrets;

    const defaultMnemonicLanguage = 'english';
    const notExistMnemonicLanguage = 'tomate';
    const invalidTestMnemonicLanguage1 = 'italian';
    const invalidTestMnemonicLanguage2 = 'japanese';
    const validTestMnemonicLanguage = 'french';
    const validTestMnemonic = 'dialogue exister sélectif isoler stimulus coupure mauve octupler dortoir portique intime bermuda retomber météore sphère frénésie polaire batterie colonel groupe refuge inexact descente daigner';
    const validTestMnemonicWithDefaultMnemonicLanguage = 'east gather super lyrics tip decrease oak present enact salmon loop bright solid onion tiger holiday run bracket curious island skate license duck dignity';
    const validTestMnemonicWithInvalidTestMnemonicLanguage1 = 'empirico gonfio splendido multiplo tardivo delfino pagina proposta esempio sabato motosega beta sgonfiare patologia tale irrorare rubrica becco curatore macabro seminato mnemonico elegante disumano';
    const validTestLastMnemonicWord = 'daigner';
    const validTestNbShares = 5;
    const validTestThreshold = 3;
    const validTestHash = '21e757e41a9e649edce32e1c5a8af2e9ec03885026641db897614a083ae6ee40b5f6f76a018b28183e14981634e5b39e425f42779be5b736a19800bc9871768d';
    const validTestHash002 = '0ec985b20f00eb6f08ccedfd95be0f5bbd2bfd6098a0930ffde1c757e1cd1e488a6ea699798d3142d35b722b3c932290be9bba9b497653abb6a844b5a0f85d5c';
    const validTestHashWithDefaultMnemonicLanguage = 'd67a590d344dce704e17b599aadd19b7664cea3d46e49fd64f99c78e1b2b4ee196fedef41ca791ca337aa61aa80fb1063e74e0588263f474dda43167a9f64b4d';
    const validTestHashWithInvalidTestMnemonicLanguage1 = '2152a0e023b9fe53a2e2c3ab74152a66b51b55a7969eb4f834fdaeb5d30cc784dc5d65a1d22c3b74ea1cb6cd93b2b193d2fadf6e84d5bd6ddb727c3e4908d502';

    const validTestShares = [
        '801646b03573f8288da6ac8d126d1ca95f3d839c5ca4575c6990cf04ceca66b41c969ac4969fa865a6eb429688c44303172',
        '802eef1ad8ff9af1678fd21b591a5f454625c4d95e84226163e94fa65b3d0e269c70f8d581dde45531ea424c5e143225322',
        '8038a9aaed8c62d9ea297e964b7743ec190c1d85f44c5edf8d5fdff7916014727806aca24cc5fa5b43348da1651a61032a1',
        '8045963d187c9a1409343c85f6c3f1c39958f0c6a6ca9df8fcc16ff0e2e44670c2709a08187feff88e559647421ac4f754d',
        '8053d08d2d0f623c84929008e4aeed6ac671299a0c02e1461277ffa128b95c242606ce7fd567f1f6fc8b59aa791497d14ce'];



    describe('Test split', function () {

        const getSplitError = function (isValidThreshold, isValidMnemonic) {
            return {
                name: "Bip39split split Error",
                message: "Split error detected",
                isValidThreshold: isValidThreshold,
                isValidMnemonic: isValidMnemonic
            };
        };

        it('Test split', function () {
            const split = Bip39split.split(
                validTestMnemonicLanguage,
                validTestMnemonic,
                validTestNbShares,
                validTestThreshold,
                bip39,
                CryptoJS,
                secrets);

            split.hash.should.be.eql(validTestHash);
            split.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            split.shares.should.be.instanceof(Array).and.have.lengthOf(validTestNbShares);

            const merge = Bip39split.merge(validTestMnemonicLanguage, split.shares, split.hash, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(split.hash);
            merge.isValidHash.should.be.true();
        });

        it('Test split with NbShares == Threshold', function () {
            const split = Bip39split.split(
                validTestMnemonicLanguage,
                validTestMnemonic,
                validTestNbShares,
                validTestNbShares,
                bip39,
                CryptoJS,
                secrets);

            split.hash.should.be.eql(validTestHash);
            split.shares.should.be.instanceof(Array).and.have.lengthOf(validTestNbShares);
            split.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);

            const merge = Bip39split.merge(validTestMnemonicLanguage, split.shares, split.hash, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(split.hash);
            merge.isValidHash.should.be.true();
        });

        it('Test split with language not exist should auto find the good on', function () {
            const split = Bip39split.split(
                notExistMnemonicLanguage,
                validTestMnemonic,
                validTestNbShares,
                validTestThreshold,
                bip39,
                CryptoJS,
                secrets);

            split.hash.should.be.eql(validTestHash);
            split.shares.should.be.instanceof(Array).and.have.lengthOf(validTestNbShares);
            split.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
        });

        it('Test split with language not fit mnemonic should auto find the good on', function () {
            const split = Bip39split.split(
                invalidTestMnemonicLanguage1,
                validTestMnemonic,
                validTestNbShares,
                validTestThreshold,
                bip39,
                CryptoJS,
                secrets);

            split.hash.should.be.eql(validTestHash);
            split.shares.should.be.instanceof(Array).and.have.lengthOf(validTestNbShares);
            split.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
        });

        it('Test split with threshold < 2', function () {
            (function () {
                Bip39split.split(
                    validTestMnemonicLanguage,
                    validTestMnemonic,
                    validTestNbShares,
                    1,
                    bip39,
                    CryptoJS,
                    secrets);
            }).should.throw(getSplitError(false, true));
        });

        it('Test split with nbShares > Threshold', function () {
            (function () {
                Bip39split.split(
                    validTestMnemonicLanguage,
                    validTestMnemonic,
                    validTestNbShares,
                    validTestNbShares + 1,
                    bip39,
                    CryptoJS,
                    secrets);
            }).should.throw(getSplitError(false, true));
        });

        it('Test split with missing last world in mnemonic', function () {
            (function () {
                Bip39split.split(
                    validTestMnemonicLanguage,
                    validTestMnemonic.replace(` ${validTestLastMnemonicWord}`, ''),
                    validTestNbShares,
                    validTestThreshold,
                    bip39,
                    CryptoJS,
                    secrets);
            }).should.throw(getSplitError(true, false));
        });

        it('Test split with invalid mnemonic and bad Threshold', function () {
            (function () {
                Bip39split.split(
                    validTestMnemonicLanguage,
                    validTestMnemonic.replace(` ${validTestLastMnemonicWord}`, ''),
                    validTestNbShares,
                    validTestNbShares + 1,
                    bip39,
                    CryptoJS,
                    secrets);
            }).should.throw(getSplitError(false, false));
        });
    });

    describe('Test merge', function () {

        it('Test merge with all shares with hash', function () {
            const merge = Bip39split.merge(validTestMnemonicLanguage, validTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(validTestHash);
            merge.isValidHash.should.be.true();
        });

        it('Test merge with all shares with hash of version 0.0.2 should support old version hash', function () {
            const merge = Bip39split.merge(validTestMnemonicLanguage, validTestShares, validTestHash002, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(validTestHash);
            merge.isValidHash.should.be.true();
        });

        it('Test merge with all shares no hash', function () {
            const merge = Bip39split.merge(validTestMnemonicLanguage, validTestShares, null, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(validTestHash);
            merge.isValidHash.should.be.false();
        });

        it('Test merge with minimun shares (front)', function () {
            (validTestThreshold).should.be.lessThan(validTestNbShares);
            var minimunTestShares = [];
            for (let i = 0; i < validTestThreshold; i++) {
                minimunTestShares.push(validTestShares[i]);
            }
            const merge = Bip39split.merge(validTestMnemonicLanguage, minimunTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(validTestHash);
            merge.isValidHash.should.be.true();
        });

        it('Test merge with minimun shares (end)', function () {
            (validTestThreshold).should.be.lessThan(validTestNbShares);
            var minimunTestShares = [];
            for (let i = 1; i <= validTestThreshold; i++) {
                minimunTestShares.push(validTestShares[validTestShares.length - i]);
            }
            const merge = Bip39split.merge(validTestMnemonicLanguage, minimunTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonic);
            merge.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge.mnemonicHash.should.be.eql(validTestHash);
            merge.isValidHash.should.be.true();
        });

        it('Test merge with lower shares count than threshold', function () {
            (validTestThreshold).should.be.greaterThan(2);
            (validTestShares.length).should.be.greaterThan(2);
            (function () {
                Bip39split.merge(validTestMnemonicLanguage, [validTestShares[0], validTestShares[1]], validTestHash, bip39, CryptoJS, secrets);
            }).should.throw({
                name: "Bip39split merge Error",
                message: "Merge error detected",
                isValidShares: false
            });
        });

        it('Test merge with invalid language and good hash should auto correct the language', function () {
            const merge1 = Bip39split.merge(invalidTestMnemonicLanguage1, validTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge1.mnemonic.should.be.eql(validTestMnemonic);
            merge1.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge1.mnemonicHash.should.be.eql(validTestHash);
            merge1.isValidHash.should.be.true();

            const merge2 = Bip39split.merge(invalidTestMnemonicLanguage2, validTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge2.mnemonic.should.be.eql(validTestMnemonic);
            merge2.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge2.mnemonicHash.should.be.eql(validTestHash);
            merge2.isValidHash.should.be.true();

            const merge3 = Bip39split.merge(notExistMnemonicLanguage, validTestShares, validTestHash, bip39, CryptoJS, secrets);
            merge3.mnemonic.should.be.eql(validTestMnemonic);
            merge3.mnemonicLanguage.should.be.eql(validTestMnemonicLanguage);
            merge3.mnemonicHash.should.be.eql(validTestHash);
            merge3.isValidHash.should.be.true();
        });

        it('Test merge with invalid language and good hash version 0.0.2 should not auto correct the language', function () {
            const merge = Bip39split.merge(invalidTestMnemonicLanguage1, validTestShares, validTestHash002, bip39, CryptoJS, secrets);
            merge.mnemonic.should.be.eql(validTestMnemonicWithInvalidTestMnemonicLanguage1);
            merge.mnemonicLanguage.should.be.eql(invalidTestMnemonicLanguage1);
            merge.mnemonicHash.should.be.eql(validTestHashWithInvalidTestMnemonicLanguage1);
            merge.isValidHash.should.be.true();
        });

        it('Test merge with invalid language and no hash should fallback to english', function () {
            const merge1 = Bip39split.merge(notExistMnemonicLanguage, validTestShares, null, bip39, CryptoJS, secrets);
            merge1.mnemonic.should.be.eql(validTestMnemonicWithDefaultMnemonicLanguage);
            merge1.mnemonicLanguage.should.be.eql(defaultMnemonicLanguage);
            merge1.mnemonicHash.should.be.eql(validTestHashWithDefaultMnemonicLanguage);
            merge1.isValidHash.should.be.false();
        });

        it('Test merge with bad language and no hash should use bad language', function () {
            const merge1 = Bip39split.merge(invalidTestMnemonicLanguage1, validTestShares, null, bip39, CryptoJS, secrets);
            merge1.mnemonic.should.be.eql(validTestMnemonicWithInvalidTestMnemonicLanguage1);
            merge1.mnemonicLanguage.should.be.eql(invalidTestMnemonicLanguage1);
            merge1.mnemonicHash.should.be.eql(validTestHashWithInvalidTestMnemonicLanguage1);
            merge1.isValidHash.should.be.false();
        });
    });


    const testFiles = ['data-v0.0.2.json', 'data-v0.0.3.json'];
    let loadJSON;
    if (typeof require !== "undefined") {
        const fs = require('fs');
        loadJSON = function (fileName, callback) {
            fs.readFile(`./test/data/${fileName}`, (err, data) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, JSON.parse(data));
            });
        };
    } else {
        loadJSON = function (fileName, callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/test/data/' + fileName, true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4) {
                    if (xobj.status == "200") {
                        callback(null, JSON.parse(xobj.responseText));
                    } else {
                        callback('Error status=' + xobj.status);
                    }
                }
            };
            xobj.send(null);
        };
    }

    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function combinationUtil(arr, data, start, end, index, r, combinations) {
        if (index == r) {
            let combination = [];
            for (let j = 0; j < r; j++) {
                combination.push(data[j]);
            }
            combinations.push(combination);
            return;
        }

        for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
            data[index] = arr[i];
            combinationUtil(arr, data, i + 1, end, index + 1, r, combinations);
        }
    }

    // The main function that return all combinations of size r  https://www.geeksforgeeks.org/print-all-possible-combinations-of-r-elements-in-a-given-array-of-size-n/
    function getCombinations(arr, r) {
        let n = arr.length;
        let data = [];
        let combinations = [];
        combinationUtil(arr, data, 0, n - 1, 0, r, combinations);
        return combinations;
    }

    describe('Test data (' + testFiles.length + ')', function () {
        testFiles.forEach(function (testFile) {

            let testData = {};

            describe('Test file: ' + testFile, function () {

                before("Load Test data", function (done) {
                    this.timeout(1 * MINUTE);
                    loadJSON(testFile, function (err, data) {
                        if (err) {
                            done(err)
                            return;
                        }
                        testData = data;
                        done();
                    });
                });

                it('Test merge with all possible combinaison with minimun shares', function () {
                    this.timeout(4 * MINUTE);
                    let count = 0;
                    testData.tests.length.should.be.greaterThan(0);
                    testData.tests.forEach(function (test) {
                        var combinations = getCombinations(test.split.shares, test.threshold);
                        combinations.forEach(function (combination) {
                            const merge = Bip39split.merge(test.split.mnemonicLanguage, combination, test.split.hash, bip39, CryptoJS, secrets);
                            merge.mnemonic.should.be.eql(test.mnemonic);
                            merge.mnemonicLanguage.should.be.eql(test.split.mnemonicLanguage);
                            merge.isValidHash.should.be.true();
                            count++;
                        });
                    });
                    console.log("          Merge qty: " + count);
                });

                it('Test merge with all shuffle shares', function () {
                    this.timeout(4 * MINUTE);
                    let count = 0;
                    testData.tests.length.should.be.greaterThan(0);
                    testData.tests.forEach(function (test) {
                        shuffleArray(test.split.shares);
                        const merge = Bip39split.merge(test.split.mnemonicLanguage, test.split.shares, test.split.hash, bip39, CryptoJS, secrets);
                        merge.mnemonic.should.be.eql(test.mnemonic);
                        merge.mnemonicLanguage.should.be.eql(test.split.mnemonicLanguage);
                        merge.isValidHash.should.be.true();
                        count++;
                    });
                    console.log("          Merge qty: " + count);
                });
            });
        });
    });
});