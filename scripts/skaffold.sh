# Get docker settings from cluster
eval $(minikube docker-env -p s66-cloud-services)

# Set config to local cluster
skaffold config set --kube-context s66-cloud-services local-cluster true

# Start skaffold dev
skaffold dev