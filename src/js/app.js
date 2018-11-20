var QRC = qrcodegen.QrCode;
let scanner;

function CloseModal(){
  if(scanner){
	scanner.stop();
  }
  var scanModalElement = document.getElementById("scan-modal");
  scanModalElement.classList.remove("active"); 
}

function Scan(resultId){
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
function AddShares(){
  var template = document.getElementById('reconstruct_share_template').innerHTML;
  var output = Mustache.render(template, {id : nextShareId });
  var restShareGroupElement = document.getElementById("rest-share-group");
  restShareGroupElement.innerHTML += output;
  nextShareId += 1;
}

function Reconstruct(){
  var languageElement = document.getElementById("rest-language");
  var wordlist = bip39.wordlists[languageElement.value];

  var restShares = [];
  for(var i=1;i<nextShareId;i++){
	var shareElement = document.getElementById("share-" + i);
	if (shareElement.value.trim() != ''){
	  restShares.push(shareElement.value.trim());
	}
  }

  var isValid = false;
  try {
	var entropy = secrets.combine( restShares )
	var mnemonic = bip39.entropyToMnemonic(entropy, wordlist);
	isValid = bip39.validateMnemonic(mnemonic, wordlist);
  }
  catch(err) {
	// ignore
  }

  var mergeResultElement = document.getElementById("merge-result");
  var mergeResultMnemonicElement = document.getElementById("merge-result-mnemonic");
  
  var restShareFormElement = document.getElementById("rest-share-form");
  
  var restHashFormElement = document.getElementById("rest-hash-form");
  restHashFormElement.classList.remove("has-error");
  restHashFormElement.classList.remove("has-success");

  if (isValid){
	restShareFormElement.classList.add("has-success");
	restShareFormElement.classList.remove("has-error");
	mergeResultMnemonicElement.innerText = mnemonic;
	mergeResultElement.style.display = "block";

	var restoreHash = CryptoJS.SHA3(entropy).toString()
	var validationHashElement = document.getElementById("validation-hash");
	if (validationHashElement.value.trim()){
	  
	  if(validationHashElement.value.trim() === restoreHash){
		restHashFormElement.classList.add("has-success");
	  } else {
		restHashFormElement.classList.add("has-error");
	  }
	} else {
	  validationHashElement.value = restoreHash;
	}
	
  } else {
	restShareFormElement.classList.add("has-error");
	restShareFormElement.classList.remove("has-success");
	mergeResultMnemonicElement.innerText = '';
	mergeResultElement.style.display = "none";
  }
}

function FindWord(worldStart){
  var match = [];
  var languageElement = document.getElementById("language");
  var wordlist = bip39.wordlists[languageElement.value];
  wordlist.forEach(function(word) {
	if (word.startsWith(worldStart)){
	  match.push(word);
	}
  });
  return match;
}

function OnInput (event) {
  var autocompleteElement = document.getElementById("autocomplete");
  if (!autocompleteElement.checked){
	return;
  }

  var patt = new RegExp("[^ ]+$");
  var res = patt.exec(event.target.value);
  if (res != null && res.length > 0){
	var worldStart = res[0].toLowerCase();
	var posibility = FindWord(worldStart);
	if (posibility.length == 1){
	  var append = posibility[0].substring(worldStart.length);
	  event.target.value += append + " ";          
	}
  }
}

function makeid() {
  var text = "1";
  var possible = "ABCDEF0123456789";
  for (var i = 0; i < 8; i++) {
	text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function split() {

  var isValidElement = document.getElementById("isValid");
  var isNotValidElement = document.getElementById("isNotValid");
  var mnemonicElement = document.getElementById("mnemonic");
  var languageElement = document.getElementById("language");
  var nbSharesElement = document.getElementById("nbShares");
  var thresholdElement = document.getElementById("threshold");
  var piecesElement = document.getElementById("pieces");
  var mnemonicFormGroupElement = document.getElementById("mnemonic-form-group");
  
  var isValidThresholdElement = document.getElementById("isValidThreshold");
  var isNotValidThresholdElement = document.getElementById("isNotValidThreshold");
  var thresholdFormGroupElement = document.getElementById("threshold-form-group");
  var nbSharesFormGroupElement = document.getElementById("nbShares-form-group");
  var printBtnElement = document.getElementById("print-btn");
  
  var nbShares = parseInt(nbSharesElement.value);
  var threshold = parseInt(thresholdElement.value);

  var wordlist = bip39.wordlists[languageElement.value];
  var mnemonic = mnemonicElement.value.trim();

  var hasError = false;
  var isValid = bip39.validateMnemonic(mnemonic, wordlist)
  piecesElement.innerHTML = "";
  if (!isValid) {
	hasError = true;
	isNotValidElement.style.display = "block";
	isValidElement.style.display = "none";
	mnemonicFormGroupElement.classList.add("has-error");
	mnemonicFormGroupElement.classList.remove("has-success");
  } else {
	isValidElement.style.display = "block";
	isNotValidElement.style.display = "none";
	mnemonicFormGroupElement.classList.remove("has-error");
	mnemonicFormGroupElement.classList.add("has-success");
  }
 
  if (threshold < 2 || threshold > nbShares ){
	hasError = true;
	isNotValidThresholdElement.style.display = "block";
	isValidThresholdElement.style.display = "none";
	thresholdFormGroupElement.classList.add("has-error");
	thresholdFormGroupElement.classList.remove("has-success");
	nbSharesFormGroupElement.classList.add("has-error");
	nbSharesFormGroupElement.classList.remove("has-success");
  } else {
	isValidThresholdElement.style.display = "block";
	isNotValidThresholdElement.style.display = "none";
	thresholdFormGroupElement.classList.remove("has-error");
	thresholdFormGroupElement.classList.add("has-success");
	nbSharesFormGroupElement.classList.remove("has-error");
	nbSharesFormGroupElement.classList.add("has-success");
  }
  if (hasError){
	printBtnElement.style.display = "none";
	return;
  }
  printBtnElement.style.display = "block";

  var entropy = bip39.mnemonicToEntropy(mnemonic, wordlist);
  var hash = CryptoJS.SHA3(entropy).toString();

  var shares = secrets.share(entropy, nbShares, threshold, 0);
  var thresholdKey = "threshold_" + threshold;

  var qrHash = QRC.encodeText(hash, QRC.Ecc.HIGH);
  var codeHash = qrHash.toSvgString(4);

  var view = {
	id : makeid(),
	language: languageElement.options[languageElement.selectedIndex].text,
	nbShares: nbShares,
	threshold: threshold,
	hash : hash,
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
		id : j+1,
		style : (i == j?"selected":"")
	  });
	}

	view.shares.push(viewshare);
  }
  var template = document.getElementById('pieces_template').innerHTML;
  var output = Mustache.render(template, view);
  piecesElement.innerHTML = output;
}