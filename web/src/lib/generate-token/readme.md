# Generate token with rsa keys
Es necesario contar con una version de NodeJS 20 o superior

# Install

1. npm install
```bash
nvm install
```

2. use node
```
nvm use
```

3. install packages
```
npm install
```

# usage

1. generate token jwt
```
npm run generate-token issuer=ligo audience=ligo-calidad.com subject=ligo@gmail.com companyId=e8b4a36d-6f1d-4a2a-bf3a-ce9371dde4ab

npm run generate-token issuer=ligo audience=ligo-calidad.com subject=ligo@gmail.com companyId=d10418c5-96bf-472c-a384-dc67d6d0eb12
```
2. Set value on api auth

Una vez generado el token se debe enviar como Bearer token a la API /v1/auth/sign-in.
