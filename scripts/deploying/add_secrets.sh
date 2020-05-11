# Add auth secret for postgres
kubectl create secret generic mysql-auth --from-literal=user=root --from-literal=password=root