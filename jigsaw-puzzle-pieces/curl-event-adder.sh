TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImxldG1lYWRkZXZlbnRzIiwiaWF0IjoxNTA2NDQ5MzY5fQ.b424_s5JR7uR8Q9iExS8qIXRXAhVDNSUJKoKZ6JA4eA'
curl -i -XPOST localhost:4004 -d 'somedata=here' -H "Authorization: Bearer $TOKEN"
