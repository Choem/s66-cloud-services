# Add repo
helm repo add appscode https://charts.appscode.com/stable/

# Update repo
helm repo update

# Install operator
helm upgrade --install kubedb-operator --namespace kube-system appscode/kubedb

# Wait for kubedb operator to be rolled out
kubectl rollout status -w deployment/kubedb-operator --namespace=kube-system

# Finish installing operator first
echo 'Waiting for kubedb-operator to be installed'
sleep 2m

# Install kubedb catalog
helm upgrade --install kubedb-catalog --namespace kube-system appscode/kubedb-catalog
