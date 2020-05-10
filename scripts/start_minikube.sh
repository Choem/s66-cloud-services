# Start minikube with specific profile
minikube start -p s66-cloud-services --vm-driver=kvm2 

# Enable ingress conrollers
minikube addons enable ingress