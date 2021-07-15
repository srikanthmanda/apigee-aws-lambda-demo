var options = {
	accessKeyId: context.getVariable("private.accessKeyId"),
	secretAccessKey: context.getVariable("private.secretAccessKey"),
	region: context.getVariable("private.region")
};
// print("options: " + JSON.stringify(options));

var params = {
	RoleArn: context.getVariable("private.lambdaRoleArn"),
	RoleSessionName: "apigee"
};
// print("params: " + JSON.stringify(params));

var sts = new STS(options);
sts.assumeRole(params, function(err, data) {
	if (err) {
		print("STS error: " + JSON.stringify(err));
		throw err;
	} else {
		// print("STS response: " + JSON.stringify(data));
		context.setVariable("private.accessKeyId", data.Credentials.AccessKeyId);
		context.setVariable("private.secretAccessKey", data.Credentials.SecretAccessKey);
		context.setVariable("private.sessionToken", data.Credentials.SessionToken);
		context.setVariable("private.expiration", data.Credentials.Expiration);
	}
});