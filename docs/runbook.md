# Runbook for Windows

## Setting up AWS CLI

1. Configure user credentials in AWS CLI: `aws configure`
2. Verify configured user: `aws sts get-caller-identity`


## Creating & Testing the Stack

### Create Stack

```
aws cloudformation create-stack `
--stack-name apigeeDemo `
--template-body file://aws-cloudformation-stack.yaml `
--capabilities CAPABILITY_NAMED_IAM
```

Notes:
+ The `` ` `` at the line endings in above code block indicates multi-line command for Windows PowerShell.
+ Replace it with `\` for Unix and `^` for Windows commandline.

### Check Stack Status

```
aws cloudformation describe-stacks --stack-name apigeeDemo --query 'Stacks[0].StackStatus'
```

Expected output: `"CREATE_COMPLETE"`

### Invoke Lambda Functions:

```
aws lambda invoke --function-name apigeeDemo-putUser `
--cli-binary-format raw-in-base64-out `
--payload '{\"metadata\":{\"xCorrelationId\":\"test-corr-id1\"},\"data\":{\"username\":\"awscli\",\"attr1\":\"val1\",\"attr2\":\"val2\"}}' `
putUserOutput.log
```

```
aws lambda invoke --function-name apigeeDemo-getUser `
--cli-binary-format raw-in-base64-out `
--payload '{\"metadata\":{\"xCorrelationId\":\"test-corr-id2\"},\"data\":{\"username\":\"awscli\"}}' `
getUserOutput.log
```

Expected output in both cases:
```
ExecutedVersion: $LATEST
StatusCode: 200

```

## Get Details for Apigee KVM

Note the output of following two sections and create a KVM in Apigee.

### Names & Execution Role ARNs of the Lambda functions

```
aws cloudformation describe-stacks --stack-name apigeeDemo --query 'Stacks[0].Outputs[*].[ExportName, OutputValue]'
```

### Access Credentials 

```
aws iam create-access-key --user-name apigeeDemo-stsUser
```

## Deleting the Stack

```
aws cloudformation delete-stack --stack-name apigeeDemo
```

## Appendix

### STS Operations with AWS-CLI

#### Requesting Temporary Credenials

```
aws sts assume-role --role-arn <lambdaExecutionRoleArn> --role-session-name awscli
```

#### Managing Temporary Credentials

AWS CLI retrieves temporary credentials from environment variables. Following is how to set them in Windows:
```
SET AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxx
SET AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SET AWS_SESSION_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Following is how to reset the AWS temporary credentials in Windows environment:
```
SET "AWS_ACCESS_KEY_ID="
SET "AWS_SECRET_ACCESS_KEY="
SET "AWS_SESSION_TOKEN="
```

Note:
+ Both the above code blocks have three separate commands each, not multi-line commands.
+ Hence no `` ` `` or `\` or `^` at the line-endings.

## Resources

+ AWS CLI Reference: https://docs.aws.amazon.com/cli/latest/index.html
+ Filtering AWS CLI output: https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html
