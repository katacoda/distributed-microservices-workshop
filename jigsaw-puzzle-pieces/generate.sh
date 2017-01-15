# Root Certificate Authority
openssl genrsa -out root-ca.private.key.pem 2048

# Self-sign Root Certificate Authority
# This will be distributed to clients to connect to services
openssl req \
  -x509 \
  -new \
  -nodes \
  -key root-ca.private.key.pem \
  -days 1024 \
  -out root-ca.cert.pem \
  -subj "/C=UK/ST=London"

# Create a Device Certificate for each service
openssl genrsa \
  -out private-key.pem \
  2048

# Request Cert (csr) signed by private key
# This will be based on 127.0.0.1 or DNS name catalogue.service.consul
openssl req -new -sha256 \
  -key private-key.pem \
  -out catalogue-csr.pem \
  -subj "/C=UK/ST=London/CN=catalogue-service" -reqexts SAN \
  -config <(cat openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:catalogue.service.consul,IP:127.0.0.1"))

openssl req -in catalogue-csr.pem -text -noout

openssl req -text -noout -verify -in catalogue-csr.pem

# Sign Cert with Root CA
# This will be deployed to the service
# It will need to be rotated every 30 days
openssl x509 \
  -req -in catalogue-csr.pem \
  -CA root-ca.cert.pem \
  -CAkey root-ca.private.key.pem \
  -CAcreateserial \
  -out catalogue-cert.pem \
  -days 30 \
  -extfile <(cat openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:catalogue.service.consul,IP:127.0.0.1")) \
  -extensions SAN

openssl x509 -in catalogue-cert.pem -text -noout

openssl verify -verbose -x509_strict -CAfile root-ca.cert.pem catalogue-cert.pem




echo "Generate curl ca-cert bundle using "
echo "openssl s_client -cert production/catalogue-cert.pem -key production/private-key.pem -servername 127.0.0.1 -showcerts -connect 127.0.0.1:4001  </dev/null 2>/dev/null | openssl x509 -text > cacert.crt"
