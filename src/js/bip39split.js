

class Bip39split {

    static split(mnemonicLanguage, mnemonic, nbShares, threshold, bip39Module, cryptoJSModule, secretsModule) {
        const DefaultWordlist = 'english';
        var validationError = {
            name: "Bip39split split Error",
            message: "Split error detected",
            isValidThreshold: true,
            isValidMnemonic: true
        };

        if (threshold < 2 || threshold > nbShares) {
            validationError.isValidThreshold = false; // Threshold is invalid. Must be at beetween 2 and number of shares
        }

        var wordlist = bip39Module.wordlists[mnemonicLanguage];
        if (!wordlist) {
            wordlist = bip39Module.wordlists[DefaultWordlist];
            mnemonicLanguage = DefaultWordlist;
        }
        validationError.isValidMnemonic = bip39Module.validateMnemonic(mnemonic, wordlist) // Check if Bip39 Mnemonic is valid.		

        // Try fix the language
        if (!validationError.isValidMnemonic) {
            var languages = ["english", "french", "italian", "spanish", "korean", "japanese", "chinese_traditional", "chinese_simplified"];
            for (let i = 0; i < languages.length; i++) {
                var language = languages[i];
                mnemonicLanguage = language;
                wordlist = bip39Module.wordlists[language];
                validationError.isValidMnemonic = bip39Module.validateMnemonic(mnemonic, wordlist) // Check if Bip39 Mnemonic is valid.
                if (validationError.isValidMnemonic) {
                    break;
                }
            }
        }

        if (!validationError.isValidMnemonic || !validationError.isValidThreshold) {
            throw validationError;
        }

        var entropy = bip39Module.mnemonicToEntropy(mnemonic, wordlist);
        //var hash = cryptoJSModule.SHA3(entropy).toString(); // Version <= 0.0.2 hash is the entropy hash
        var hash = cryptoJSModule.SHA3(mnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash

        var shares = secretsModule.share(entropy, nbShares, threshold, 0);

        return {
            hash: hash,
            shares: shares,
            mnemonicLanguage: mnemonicLanguage
        };
    }

    static merge(mnemonicLanguage, shares, hash, bip39Module, cryptoJSModule, secretsModule) {
        const DefaultWordlist = 'english';
        var wordlist = bip39Module.wordlists[mnemonicLanguage];
        if (!wordlist) {
            wordlist = bip39Module.wordlists[DefaultWordlist];
            mnemonicLanguage = DefaultWordlist;
        }

        try {
            var entropy = secretsModule.combine(shares)
            var mnemonic = bip39Module.entropyToMnemonic(entropy, wordlist);
            var isValidMnemonic = bip39Module.validateMnemonic(mnemonic, wordlist);
        }
        catch (err) {
            isValidMnemonic = false
        }

        if (!isValidMnemonic) {
            throw {
                name: "Bip39split merge Error",
                message: "Merge error detected",
                isValidShares: false
            };
        }

        var restoreEntropyHash = cryptoJSModule.SHA3(entropy).toString(); // Version <= 0.0.2 hash is the entropy hash
        var restoreMnemonicHash = cryptoJSModule.SHA3(mnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash
        var isValidHash = false;
        if (hash) {
            if (restoreEntropyHash == hash) {
                isValidHash = true;
            } else if (restoreMnemonicHash == hash) {
                isValidHash = true;
            } else {
                // TRY Auto Correct mnemonic language
                try {
                    var languages = ["english", "french", "italian", "spanish", "korean", "japanese", "chinese_traditional", "chinese_simplified"];
                    for (let i = 0; i < languages.length; i++) {
                        var language = languages[i];
                        var wordlist = bip39Module.wordlists[language];
                        var entropy = secretsModule.combine(shares)
                        var autoMnemonic = bip39Module.entropyToMnemonic(entropy, wordlist);
                        var isValidMnemonic = bip39Module.validateMnemonic(autoMnemonic, wordlist);
                        var autoRestoreMnemonicHash = cryptoJSModule.SHA3(autoMnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash
                        if (isValidMnemonic && autoRestoreMnemonicHash == hash) {
                            return {
                                mnemonic: autoMnemonic,
                                mnemonicLanguage: language,
                                mnemonicHash: autoRestoreMnemonicHash,
                                isValidHash: true
                            }
                        }
                    }
                }
                catch (err) {
                    // ignore
                }
            }
        }

        return {
            mnemonic: mnemonic,
            mnemonicLanguage: mnemonicLanguage,
            mnemonicHash: restoreMnemonicHash,
            isValidHash: isValidHash
        }
    }
}

if (typeof module !== "undefined") {
    module.exports = Bip39split;
} else {
    window.Bip39split = Bip39split;
}