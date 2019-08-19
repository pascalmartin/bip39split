var QRC = qrcodegen.QrCode;
let scanner;

function CloseModal() {
	if (scanner) {
		scanner.stop();
	}
	var scanModalElement = document.getElementById("scan-modal");
	scanModalElement.classList.remove("active");
}

function Scan(resultId) {
	var resultElement = document.getElementById(resultId);
	var scanModalElement = document.getElementById("scan-modal");
	scanModalElement.classList.add("active");

	scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
	scanner.addListener('scan', function (content) {
		console.log(content);
		scanModalElement.classList.remove("active");
		resultElement.value = content;
		scanner.stop()
	});
	Instascan.Camera.getCameras().then(function (cameras) {
		if (cameras.length > 0) {
			camera = cameras[0];
			scanner.start(cameras[0]);
		} else {
			console.error('No cameras found.');
		}
	}).catch(function (e) {
		console.error(e);
	});

}

var nextShareId = 4;
function AddShares() {
	var template = document.getElementById('reconstruct_share_template').innerHTML;
	var output = Mustache.render(template, { id: nextShareId });
	var restShareGroupElement = document.getElementById("rest-share-group");
	var div = document.createElement('div');
	div.innerHTML = output;
	restShareGroupElement.appendChild(div);
	nextShareId += 1;
}

function ShowSharesError() {
	var mergeResultElement = document.getElementById("merge-result");
	var mergeResultMnemonicElement = document.getElementById("merge-result-mnemonic");
	var restShareFormElement = document.getElementById("rest-share-form");

	restShareFormElement.classList.add("has-error");
	restShareFormElement.classList.remove("has-success");
	mergeResultMnemonicElement.innerText = '';
	mergeResultElement.style.display = "none";
}

function ShowSharesSuccess() {
	var mergeResultElement = document.getElementById("merge-result");
	var mergeResultMnemonicElement = document.getElementById("merge-result-mnemonic");
	var restShareFormElement = document.getElementById("rest-share-form");

	restShareFormElement.classList.add("has-success");
	restShareFormElement.classList.remove("has-error");
	mergeResultMnemonicElement.innerText = mnemonic;
	mergeResultElement.style.display = "block";
}

function HideHashErrorOrSuccess() {
	var restHashFormElement = document.getElementById("rest-hash-form");
	restHashFormElement.classList.remove("has-error");
	restHashFormElement.classList.remove("has-success");
}

function ShowHashError() {
	var restHashFormElement = document.getElementById("rest-hash-form");
	restHashFormElement.classList.add("has-error");
	restHashFormElement.classList.remove("has-success");
}

function ShowHashSuccess() {
	var restHashFormElement = document.getElementById("rest-hash-form");
	restHashFormElement.classList.add("has-success");
	restHashFormElement.classList.remove("has-error");
}

function HideReconstructResult() {
	var mergeResultElement = document.getElementById("merge-result");
	var mergeResultMnemonicElement = document.getElementById("merge-result-mnemonic");
	var mergeResulthashElement = document.getElementById("merge-result-hash");
	mergeResultMnemonicElement.innerText = '';
	mergeResulthashElement.innerText = '';
	mergeResultElement.style.display = "none";
}

function ShowReconstructResult(result) {
	var mergeResultElement = document.getElementById("merge-result");
	var mergeResultMnemonicElement = document.getElementById("merge-result-mnemonic");
	var mergeResulthashElement = document.getElementById("merge-result-hash");
	var languageElement = document.getElementById("rest-language");
	mergeResultMnemonicElement.innerText = result.mnemonic;
	mergeResulthashElement.innerText = result.mnemonicHash;
	mergeResultElement.style.display = "block";
	languageElement.value = result.mnemonicLanguage;
}

function Reconstruct() {
	var languageElement = document.getElementById("rest-language");
	var validationHashElement = document.getElementById("validation-hash");
	var validationHash = validationHashElement.value.trim();

	var restShares = [];
	for (var i = 1; i < nextShareId; i++) {
		var shareElement = document.getElementById("share-" + i);
		if (shareElement.value.trim() != '') {
			restShares.push(shareElement.value.trim());
		}
	}

	HideReconstructResult();
	HideHashErrorOrSuccess();

	try {
		var result = Bip39split.merge(languageElement.value, restShares, validationHash, bip39, CryptoJS, secrets);
		ShowSharesSuccess();
		ShowReconstructResult(result);

		if (validationHash) {
			if (result.isValidHash) {
				ShowHashSuccess();
			} else {
				ShowHashError();
			}
		}
	}
	catch (err) {
		HideHashErrorOrSuccess();
		ShowSharesError();
	}
}

function FindWord(worldStart) {
	var match = [];
	var languageElement = document.getElementById("language");
	var wordlist = bip39.wordlists[languageElement.value];
	wordlist.forEach(function (word) {
		if (word.startsWith(worldStart)) {
			match.push(word);
		}
	});
	return match;
}

function OnInput(event) {
	var autocompleteElement = document.getElementById("autocomplete");
	if (!autocompleteElement.checked) {
		return;
	}

	var patt = new RegExp("[^ ]+$");
	var res = patt.exec(event.target.value);
	if (res != null && res.length > 0) {
		var worldStart = res[0].toLowerCase();
		var posibility = FindWord(worldStart);
		if (posibility.length == 1) {
			var append = posibility[0].substring(worldStart.length);
			event.target.value += append + " ";
		}
	}
}

function Makeid() {
	var text = "1";
	var possible = "ABCDEF0123456789";
	for (var i = 0; i < 8; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function ShowThresholdError() {
	var isValidThresholdElement = document.getElementById("isValidThreshold");
	var isNotValidThresholdElement = document.getElementById("isNotValidThreshold");
	var thresholdFormGroupElement = document.getElementById("threshold-form-group");
	var nbSharesFormGroupElement = document.getElementById("nbShares-form-group");

	isNotValidThresholdElement.style.display = "block";
	isValidThresholdElement.style.display = "none";
	thresholdFormGroupElement.classList.add("has-error");
	thresholdFormGroupElement.classList.remove("has-success");
	nbSharesFormGroupElement.classList.add("has-error");
	nbSharesFormGroupElement.classList.remove("has-success");
}

function ShowThresholdSuccess() {
	var isValidThresholdElement = document.getElementById("isValidThreshold");
	var isNotValidThresholdElement = document.getElementById("isNotValidThreshold");
	var thresholdFormGroupElement = document.getElementById("threshold-form-group");
	var nbSharesFormGroupElement = document.getElementById("nbShares-form-group");

	isValidThresholdElement.style.display = "block";
	isNotValidThresholdElement.style.display = "none";
	thresholdFormGroupElement.classList.remove("has-error");
	thresholdFormGroupElement.classList.add("has-success");
	nbSharesFormGroupElement.classList.remove("has-error");
	nbSharesFormGroupElement.classList.add("has-success");
}

function ShowMnemonicError() {
	var isValidElement = document.getElementById("isValid");
	var isNotValidElement = document.getElementById("isNotValid");
	var mnemonicFormGroupElement = document.getElementById("mnemonic-form-group");

	isNotValidElement.style.display = "block";
	isValidElement.style.display = "none";
	mnemonicFormGroupElement.classList.add("has-error");
	mnemonicFormGroupElement.classList.remove("has-success");
}

function ShowMnemonicSuccess() {
	var isValidElement = document.getElementById("isValid");
	var isNotValidElement = document.getElementById("isNotValid");
	var mnemonicFormGroupElement = document.getElementById("mnemonic-form-group");

	isValidElement.style.display = "block";
	isNotValidElement.style.display = "none";
	mnemonicFormGroupElement.classList.remove("has-error");
	mnemonicFormGroupElement.classList.add("has-success");
}

function Split() {
	var mnemonicElement = document.getElementById("mnemonic");
	var languageElement = document.getElementById("language");
	var nbSharesElement = document.getElementById("nbShares");
	var thresholdElement = document.getElementById("threshold");
	var piecesElement = document.getElementById("pieces");
	var printBtnElement = document.getElementById("print-btn");

	var nbShares = parseInt(nbSharesElement.value);
	var threshold = parseInt(thresholdElement.value);
	var thresholdKey = "threshold_" + threshold;
	var mnemonic = mnemonicElement.value.trim();
	var splitResult = null;

	piecesElement.innerHTML = "";

	try {
		splitResult = Bip39split.split(languageElement.value, mnemonic, nbShares, threshold, bip39, CryptoJS, secrets);
	}
	catch (err) {
		if (!err.isValidThreshold) {
			ShowThresholdError();
		} else {
			ShowThresholdSuccess();
		}

		if (!err.isValidMnemonic) {
			ShowMnemonicError();
		} else {
			ShowMnemonicSuccess();
		}

		printBtnElement.style.display = "none";
		return;
	}

	ShowMnemonicSuccess();
	ShowThresholdSuccess();

	printBtnElement.style.display = "block";

	var hash = splitResult.hash;
	var shares = splitResult.shares;

	var qrHash = QRC.encodeText(hash, QRC.Ecc.HIGH);
	var codeHash = qrHash.toSvgString(4);

	var view = {
		id: Makeid(),
		language: languageElement.options[languageElement.selectedIndex].text,
		nbShares: nbShares,
		threshold: threshold,
		hash: hash,
		shares: [],
		hashQrCodeSvg: {
			viewBox: / viewBox="([^"]*)"/.exec(codeHash)[1],
			path_d: / d="([^"]*)"/.exec(codeHash)[1]
		}
	};

	for (var i = 0; i < shares.length; i++) {
		var share = shares[i];
		var qr0 = QRC.encodeText(share, QRC.Ecc.HIGH);
		var code = qr0.toSvgString(4);

		var viewshare = {
			pos: i + 1,
			share: share,
			qrCodeSvg: {
				viewBox: / viewBox="([^"]*)"/.exec(code)[1],
				path_d: / d="([^"]*)"/.exec(code)[1]
			},
			pageBreak: i == 0 ? "" : "page-break"
		};
		viewshare[thresholdKey] = [];
		for (var j = 0; j < shares.length; j++) {
			viewshare[thresholdKey].push({
				id: j + 1,
				style: (i == j ? "selected" : "")
			});
		}

		view.shares.push(viewshare);
	}
	var template = document.getElementById('pieces_template').innerHTML;
	var output = Mustache.render(template, view);
	piecesElement.innerHTML = output;
}