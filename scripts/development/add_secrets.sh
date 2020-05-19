# Add auth secret for mysql
kubectl create secret generic mysql-auth --from-literal=username=root --from-literal=password=root