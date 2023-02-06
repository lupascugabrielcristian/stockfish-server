var state = {
	signal: "Player",
	isPlayer: 1,
	cpOptions: ""
}

function showLED() {
	return {
		good: () => {
			document.getElementById("led").classList.remove("led-red");
			document.getElementById("led").classList.add("led-green");
		},
		bad: () => {
			document.getElementById("led").classList.remove("led-green");
			document.getElementById("led").classList.add("led-red");
		}
	}
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
		if ( !!option  && option < 3 ) {
			var optionsArr = state.cpOptions.split(",");
			var optionText = optionsArr[option];
			sendCPMove( optionText );
			showLED().good();
		}
		else {
			document.getElementById("signal-text").innerText = "Input!"
			showLED().bad();
		}
	}
}

function clearText() {
	document.getElementById("move-text-inside").innerText = "";
	showLED().good();
}

function sendMoveToServer() {
	var currentMoveText = document.getElementById("move-text-inside").innerText;
	fetch('/stockfishserver/mymove/xxx/'.replace("xxx", currentMoveText))
		.then( (response) => {
			return response.json();
		})
		.then( (responseJson) => {
			if ( responseJson['move_ok'] == "True") {
				showLED().good();

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
				showLED().bad();
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
				showLED().good();

				// Ecranul
				document.getElementById("signal-text").innerText = "Player"
				document.getElementById("move-text-inside").innerText = "";
				state.isPlayer = 1;
			}
		});
}

function newGame() {
	fetch('/stockfishserver/newgame/').then( (response) => {
		return response.json();
	})
	.then( (responseJson) => {
		if ( responseJson['restart'] == "ok" ) {
			document.getElementById("signal-text").innerText = "Restart";
			document.getElementById("move-text-inside").innerText = "e2e4";
			state.isPlayer = 1;
			showLED().good();
		}
	});
}
