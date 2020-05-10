# Add auth secret for postgres
kubectl create secret generic postgres-auth --from-literal=password=root