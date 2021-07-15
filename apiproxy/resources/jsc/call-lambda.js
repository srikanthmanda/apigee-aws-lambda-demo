var options = {
	accessKeyId: context.getVariable("private.accessKeyId"),
	secretAccessKey: context.getVariable("private.secretAccessKey"),
	region: context.getVariable("private.region")
};
var sessionToken = context.getVariable("private.sessionToken");
if (sessionToken) {
	options["sessionToken"] = sessionToken;
}
// print("Stringified options: " + JSON.stringify(options));

var lambda = new Lambda(options);
lambda.invoke(_getInvokeParams(context.getVariable("private.lambdaName")), function(err, res) {
	if (err) {
		print("Lambda error: " + JSON.stringify(err));
		throw err;
	} else {
		// print("Lambda response: " + JSON.stringify(res));
		response.status.code = res.StatusCode;
		response.content = res.Payload;
	}
});

function _getInvokeParams(lambdaName) {
	var event = {
		metadata: { xCorrelationId: context.getVariable("ev.xCorrelationId") }
	};
	switch (lambdaName) {
		case "apigeeDemo-getUser":
			event.data = { username: context.getVariable("ev.username") };
			break;
		case "apigeeDemo-putUser":
			event.data = JSON.parse(context.getVariable("request.content"));
			break;
		default:
			print('lambdaName: ' + lambdaName);
			throw "Unknown lambda";
	}
	return {
		FunctionName: lambdaName,
		Payload: JSON.stringify(event)
	};
}