curl --upload-file register.json http://localhost:8500/v1/agent/service/register
curl --upload-file register-ticket.json http://localhost:8500/v1/agent/service/register

curl http://localhost:8500/v1/agent/services
