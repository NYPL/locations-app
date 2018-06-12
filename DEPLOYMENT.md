# Deployment
## AWS Elastic Beanstalk Application Settings
By using the `aws-cli`, developers can deploy the Locations App to the desired AWS application environments listed below:

| AWS Profile | Application Name | Environment |
|---|---|---|
| `nypl-digital-dev` | `nypl-locations` | **QA**: `nypl-locations-qa` <br><br> **Production**: `nypl-locations-production` |
| `nypl-sandbox` | `nypl-locations` | **Development**: `nypl-locations-development` |

> Note: All QA and Development servers should be configured with only 1 instance. Production servers are typically setup with auto-scaling supporting 2 or more instances.

## AWS Deployment

### Initial Elastic Beanstalk creation
```
eb create nypl-locations-<<environment name>> \
--instance_type t2.micro \
--instance_profile cloudwatchable-beanstalk \
--cname nypl-locations-<<environment name>> \
--vpc.id <<Virtual private cloud ID from AWS account>> \
--vpc.elbsubnets <<Load balancer subnets>> \
--vpc.ec2subnets <<Instance subnets>> \
--vpc.elbpublic \
--profile <<AWS Profile Name>>
```
Please refer to NYPL/aws for configuration using to NYPL Digital AWS accounts.

### Subsequent Manual Deployments
```
eb deploy nypl-locations-<<environment name>> --profile <<AWS Profile Name>>
```
The command above CAN be used for manual deployments, and SHOULD be used for troubleshooting when the CI/CD pipeline fails.

### Travis CI
We use Travis CI integration with Github as our CI/CD pipeline. A configuration file `.travis.yml` is set up to trigger building, testing and deploying to AWS Elastic Beanstalk. The branches `development`, `qa`, and `production` are set to trigger deployment to AWS Elastic Beanstalk when build and test phases are both successful.
