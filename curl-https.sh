echo "This is likely to fail because of the curl version on OSX"
curl -v -s "https://127.0.0.1:4001" \
  --key production/private-key.pem \
  --cert production/catalogue-cert.pem \
  --cacert production/root-ca.cert.pem

echo "Need to exact it to a pkcs12, set it's password to pass"
openssl pkcs12 -export -in production/catalogue-cert.pem -inkey production/private-key.pem -out cacert.p12

echo "The server is configured to require the cert "
curl -k https://127.0.0.1:4001

curl -k -E production/cacert.p12:pass https://127.0.0.1:4001
