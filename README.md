### Sync/Backup Firebase database with another based on a cron schedule

Unfortunately, Firebase/Google cloud functions do not support cron schedule triggers out of the box.
This project is therefore used with [AWS lambdas](https://aws.amazon.com/lambda/).
 
In order to use this function, create a Lambda function, generate your DB access account keys for both your source and destination databases and upload those along with the function.

You will need to zip the node_modules along with the index.js and the aformentioned keys.

The only ***caveat*** is depending on where you run npm install, it might generate the wrong version of grpc_node.node.
At the time of writing, AWS lambda is using node-v48-linux-x64 for grpc_node.node which is version controlled in this repo (extension_binary/) and can be use in your node_modules.

Otherwise you might encounter issues like the following:

https://stackoverflow.com/questions/46775815/node-v57-linux-x64-grpc-node-node-missing
