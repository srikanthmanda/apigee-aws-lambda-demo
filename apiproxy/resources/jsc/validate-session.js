print("ev.username: " + context.getVariable("ev.username"));
print("ev.xCorrelationId: " + context.getVariable("ev.xCorrelationId"));

var expiration = context.getVariable("private.expiration");
var sessionState = "invalid";

if (expiration) {
	var expiryDateTime = new Date(expiration);
	var systemDateTime = new Date(context.getVariable("system.timestamp"));

	print("expiration: "+ expiration);
	print("expiryDateTime: " + expiryDateTime);
	print("systemDateTime: " + systemDateTime);
	print("system.time: " + context.getVariable("system.time"));
	print("system.timestamp: " + context.getVariable("system.timestamp"));

	if (expiryDateTime > systemDateTime) {
		sessionState = "valid";
	}
}

print("sessionState: " + sessionState);
context.setVariable("sessionState", sessionState);

if (sessionState == "invalid") {
	switch(context.getVariable("current.flow.name")) {
		case "getuser":
			context.setVariable("requestFlow", "getuser");
			context.setVariable("kvmkey.lambdaName", "getUserLambda");
			context.setVariable("kvmkey.lambdaRoleArn", "getUserExecRoleArn");
			break;
		case "putuser":
			context.setVariable("requestFlow", "putuser");
			context.setVariable("kvmkey.lambdaName", "putUserLambda");
			context.setVariable("kvmkey.lambdaRoleArn", "putUserExecRoleArn");
			break;
		default:
			print("Request flow: " + context.getVariable("current.flow.name"));
			throw "Wrong request flow";
	}
}
