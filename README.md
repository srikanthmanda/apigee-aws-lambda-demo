# Apigee AWS Lambda Demo

⚠️ **BEWARE**: The API proxy of this repo demonstrates an [anti-pattern](https://docs.apigee.com/api-platform/antipatterns/service-callout-no-target). In general, it is NOT a good idea to invoke the main backend of an Apigee proxy from a policy.

__Recommendation__: Evaluate [Node.JS Hosted Targets](https://docs.apigee.com/api-platform/hosted-targets/hosted-targets-overview) and [AWS Lambda Extension](https://docs.apigee.com/api-platform/reference/extensions/aws-lambda/aws-lambda-extension-100) (though the latter doesn't support temporary credentials). Use this approach ONLY if you cannot use either hosted targets or Lambda extension.

## Why?
Setting aside the above warning and recommendation, this repo demonstrates what is possible with [Apigee policies](https://docs.apigee.com/api-platform/reference/policies/reference-overview-policy). However, it includes only few of the policies. The AWS CloudFormation template demos setting up a customer master key (CMK) to be used by AWS services for encrypting data at rest.

## How?
### Prerequisites
1. Apigee account: You can sign up for one at https://login.apigee.com/sign_up.
2. AWS account: You can sign up for one directly with AWS or sign up for [A Cloud Guru](https://acloudguru.com/) and use their AWS sandbox.

### Setting up
1. Create a CloudFormation stack named `apigeeDemo` with new resources in AWS, by uploading the file [aws-cloudformation-stack.yaml](aws-cloudformation-stack.yaml).
2. Create a new API proxy in Apigee, by uploading the bundle [lambda-proxy.zip](build/lambda-proxy.zip). (Or make any proxy changes you like in the directory [apiproxy](apiproxy/), zip it and upload it.)
3. Generate credentials for the IAM user `apigeeDemo-stsUser` in AWS console.
4. Create a new KVM named `sts_creds`, preferably in `test` environment, with the 7 keys mentioned in the file [apigee-sts_creds-kvm.yaml](apigee-sts_creds-kvm.yaml). Replace the `<placeholder>` strings with appropriate values in KVM.
5. Deploy the API proxy in the same environment as the KVM, preferably `test`.    

### Testing
1. Download the two files from [tests](tests/) directory.
2. Replace `username-randomstring-eval` with the name of your Apigee organisation as `org` key's value in [hoppscotch-environment.json](tests/hoppscotch-environment.json) file.
3. Update the `env` key's value as well in the same file if you deployed the API proxy to an environment other than `test`.
4. Import the environment and collection at https://hoppscotch.io.
5. Choose the imported environment and start testing the requests in the collection.
6. You may also enable trace in Apigee and observe the flow for all requests.

Note: Success tests at the end of the collection may fail on first try as Lambda (cold) start may take more time than the `js-call-lambda` policy's timeout. Retry should be successful.

## Resources
+ Apigee anti-patterns: https://docs.apigee.com/api-platform/antipatterns/intro
+ `aws-sdk-light` package: https://github.com/karopolopoulos/aws-sdk-light
+ Apigee documentation: https://docs.apigee.com/api-platform/get-started/get-started
+ AWS documentation: https://docs.aws.amazon.com/index.html
+ A couple of my own resources:
	+ AWS CloudFormation Attributes:
		+ https://srikanthmanda.com/aws-cloudformation-attributes/
		+ https://github.com/srikanthmanda/aws-cloudformation-attributes
	+ `aws-sdk-light-apigee-bundle`:  https://github.com/srikanthmanda/aws-sdk-light-apigee-bundle
