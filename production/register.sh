curl --upload-file register.json http://localhost:8500/v1/agent/service/register
curl --upload-file register-v2.json http://localhost:8500/v1/agent/service/register

curl http://localhost:8500/v1/agent/services

curl http://localhost:8500/v1/health/service/catalogue

dig @127.0.0.1 -p 8600 catalogue.service.consul
