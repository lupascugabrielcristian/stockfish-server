var state = {
	signal: "Player",
	isPlayer: 1,
	cpOptions: ""
}

function insertChar( textToAdd ) {
	// Daca este playerul, doar modific textul
	if ( state.isPlayer == 1 ) { 
		var currentMoveText = document.getElementById("move-text-inside").innerText;
		currentMoveText += textToAdd
		document.getElementById("move-text-inside").innerText = currentMoveText;
	}
	else {
		// Daca nu este playerul, trimit CP move
		var option = parseInt(textToAdd) - 1;
		var optionsArr = state.cpOptions.split(",");
		var optionText = optionsArr[option];
		sendCPMove( optionText );
	}
}

function clearText() {
	console.log("dfasdfasdf");
	document.getElementById("move-text-inside").innerText = "";
}

function sendMoveToServer() {
	var currentMoveText = document.getElementById("move-text-inside").innerText;
	fetch('/stockfishserver/mymove/xxx/'.replace("xxx", currentMoveText))
		.then( (response) => {
			return response.json();
		})
		.then( (responseJson) => {
			if ( responseJson['move_ok'] ) {
				// Userul a facut o mutare
				var cpOptions = responseJson['cp_options']
				var optionsText = "";
				cpOptions.forEach( (o, i) => {
					optionsText += (i + 1) + " - " + o;
					optionsText += "\n"
				})
				optionsText = optionsText.trim()

				// Set cookie
				var cookieText = cpOptions.join(",");
				document.cookie = "move_ok="+cookieText;

				// Save state
				state.cpOptions = cookieText;
				state.isPlayer = 0;

				// Ecranul
				document.getElementById("signal-text").innerText = "CP"
				document.getElementById("move-text-inside").innerText = optionsText;
			}
			else {
				// Nu a mers mutarea aleasa
				document.getElementById("signal-text").innerText = "Player!"
			}
		});
}

function sendCPMove(moveText) {
	fetch('/stockfishserver/cpmove/xxx/'.replace("xxx", moveText))
		.then( (response) => {
			return response.json();
		})
		.then( (responseJson) => {
			if ( responseJson['result'] == "ok" ) {
				// Ecranul
				document.getElementById("signal-text").innerText = "Player"
				document.getElementById("move-text-inside").innerText = "";
				state.isPlayer = 1;
			}
		});
}
