# Add auth secret for mysql
kubectl create secret generic mysql-auth --from-literal=user=root --from-literal=password=root