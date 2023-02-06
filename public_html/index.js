function submit() {
	var pass = document.getElementById("pas").value;
	document.getElementById("pas").value = "";
	fetch('/stockfishserver/verybadmove/xxx/'.replace("xxx", pass)).then( (response) => {
		return response.json();
	}).then( (responseJson) => {
		console.log("a");
	});
}
