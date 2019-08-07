
class Bip39split {

    static split(mnemonicLanguage, mnemonic, nbShares, threshold) {
        var validationError = {
            name: "Bip39split split Error",
            message: "Split error detected",
            isValidThreshold: true,
            isValidMnemonic: true
        };

        if (threshold < 2 || threshold > nbShares) {
            validationError.isValidThreshold = false; // Threshold is invalid. Must be at beetween 2 and number of shares
        }

        var wordlist = bip39.wordlists[mnemonicLanguage];
        validationError.isValidMnemonic = bip39.validateMnemonic(mnemonic, wordlist) // Check if Bip39 Mnemonic is valid.		

        if (!validationError.isValidMnemonic || !validationError.isValidThreshold) {
            throw validationError;
        }

        var entropy = bip39.mnemonicToEntropy(mnemonic, wordlist);
        var hash = CryptoJS.SHA3(entropy).toString(); // Version <= 0.0.2 hash is the entropy hash
        //var hash = CryptoJS.SHA3(mnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash

        var shares = secrets.share(entropy, nbShares, threshold, 0);

        return {
            hash: hash,
            shares: shares
        };
    }

    static merge(mnemonicLanguage, shares, hash) {
        var wordlist = bip39.wordlists[mnemonicLanguage];

        try {
            var entropy = secrets.combine(shares)
            var mnemonic = bip39.entropyToMnemonic(entropy, wordlist);
            var isValidMnemonic = bip39.validateMnemonic(mnemonic, wordlist);
        }
        catch (err) {
            isValidMnemonic = false
        }

        if (!isValidMnemonic) {
            throw {
                name: "Bip39split merge Error",
                message: "Merge error detected",
                isValidShares: false,
            };
        }

        var restoreEntropyHash = CryptoJS.SHA3(entropy).toString(); // Version <= 0.0.2 hash is the entropy hash
        var restoreMnemonicHash = CryptoJS.SHA3(mnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash
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
                        var wordlist = bip39.wordlists[language];
                        var entropy = secrets.combine(shares)
                        var autoMnemonic = bip39.entropyToMnemonic(entropy, wordlist);
                        var isValidMnemonic = bip39.validateMnemonic(autoMnemonic, wordlist);
                        var autoRestoreMnemonicHash = CryptoJS.SHA3(autoMnemonic).toString(); // Version >= 0.0.3 hash is the mnemonic hash
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