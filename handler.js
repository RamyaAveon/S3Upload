const { S3,SNS,SQS} = require('./config');

module.exports.createSNSTopic = async(event) => {
    try {
		
		const params = {
			Name: event.SNSTopicName
		}
        console.log(params);
       
		const response = await SNS.createTopic(params).promise()

		return response

	} catch (error) {
		console.log(error)
		return error
	}
};

module.exports.createSQSQueue = async (event) => {
	try {
		
		const params = {
			QueueName: event.SQSQueueName
		}

		const response = await SQS.createQueue(params).promise()

		console.log("create queue response ", response)

		const arnParams = {
			QueueUrl: response.QueueUrl,
			AttributeNames: ['QueueArn']
		}

		const arnResponse = await SQS.getQueueAttributes(arnParams).promise()

		console.log("ARN ", arnResponse)

		const policy = {
			"Version": "2012-10-17",
			"Id": event.SQSQueueName,
			"Statement": 
			  {
				 "Sid": event.SQSQueueName,
				 "Effect": "Allow",
				 "Principal": "*",
				 "Action": ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
				 "Resource": arnResponse.Attributes.QueueArn
			  }
		}
		  
		await SQS.setQueueAttributes({
			QueueUrl: response.QueueUrl,
			Attributes: {
			  Policy: JSON.stringify(policy)
			}
		}).promise()

		return response

	} catch (error) {
		console.log(error)
		return error
	}
};


module.exports.pushSNSMessage = async (event) => {
	try {
		
		const params = {
			Message: event.message,
			TopicArn: event.topicARN
		}

		const response = await SNS.publish(params).promise()

		return response

	} catch (error) {
		console.log(error)
		return error
	}
}


module.exports.addSNSSubscription = async (event) => {
	try {

		const arnParams = {
			QueueUrl: event.queue.QueueUrl,
			AttributeNames: ['QueueArn']
		}

		const arnResponse = await SQS.getQueueAttributes(arnParams).promise()

		const params = {
			Protocol: 'sqs',
			TopicArn: event.topicARN.TopicArn,
			Endpoint: arnResponse.Attributes.QueueArn
		}

		const response = await SNS.subscribe(params).promise()

		return response

	} catch (error) {
		console.log(error)
		return error
	}
}

