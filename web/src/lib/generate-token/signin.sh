export LIGO_USERNAME="{{username}}"
export LIGO_PASSWORD="{{password}}"
export LIGO_TOKEN="{{token}}"
export COMPANY_ID="e8b4a36d-6f1d-4a2a-bf3a-ce9371dde4ab"

curl --location "https://cce-auth-dev.ligocloud.tech/v1/auth/sign-in?companyId=$COMPANY_ID" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer $LIGO_TOKEN" \
--data "{
    \"username\": \"$LIGO_USERNAME\",
    \"password\": \"$LIGO_PASSWORD\"
}"
