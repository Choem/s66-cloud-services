# Start minikube with specific profile
minikube start -p s66-cloud-services --vm-driver=kvm2 --memory=8192 --cpus=4

# Enable ingress conrollers
minikube addons enable ingress -p s66-cloud-services

# Install kubedb
./scripts/development/install_kubedb.sh

# Add required secrets
./scripts/development/add_secrets.sh

# Install MySQL db
helm upgrade --install mysql ./deployments/mysql